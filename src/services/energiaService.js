"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergiaService = void 0;
class EnergiaService {
    constructor(energiaRepo, recargaRepo, notificacaoService, atividadeService) {
        this.energiaRepo = energiaRepo;
        this.recargaRepo = recargaRepo;
        this.notificacaoService = notificacaoService;
        this.atividadeService = atividadeService;
    }
    async obterConfiguracao() {
        let config = await this.energiaRepo.findFirst();
        if (!config) {
            config = await this.energiaRepo.create({ numero_contador: 123456789, total_disponivel_kwh: 0, consumo_diario_kwh: 0 });
        }
        return this.energiaRepo.findFirst();
    }
    async atualizarContador(numero, perfil) {
        const config = await this.energiaRepo.findFirst();
        if (numero <= 0) {
            throw new Error("Numero do contador deve ser positivo");
        }
        if (!config) {
            const newconfig = await this.energiaRepo.create({ numero_contador: numero, total_disponivel_kwh: 0, consumo_diario_kwh: 0 });
            await this.atividadeService.registar(`Numero de contador alterado para ${numero}`, perfil);
            return newconfig;
        }
        const atualizado = await this.energiaRepo.update({ numero_contador: numero });
        await this.atividadeService.registar(`Numero de contador alterado para: ${numero}`, perfil);
        return atualizado;
    }
    async registarRecarga(kwh, valor_pago, perfil) {
        if (kwh <= 0 || valor_pago <= 0) {
            throw new Error("Valores de energia devem ser positivos");
        }
        const recarga = await this.recargaRepo.create({ data: new Date().toISOString().split('T')[0], valor_kwh: kwh, valor_pago: valor_pago });
        const config = await this.energiaRepo.findFirst();
        if (config) {
            const novototal = Number(config.total_disponivel_kwh) + kwh;
            await this.energiaRepo.update({ total_disponivel_kwh: novototal });
        }
        else {
            await this.energiaRepo.create({ numero_contador: 123456789087, total_disponivel_kwh: kwh, consumo_diario_kwh: 0 });
        }
        await this.atividadeService.registar(`Recarga de ${kwh} kwh (${valor_pago.toLocaleString('PT-BR')})`, perfil);
        const confiAtual = await this.energiaRepo.findFirst();
        if (confiAtual) {
            if (confiAtual.total_disponivel_kwh < 20) {
                await this.notificacaoService.criar('Energia abaixo de 20 kwh - recarregue o mais rapido possivel.', 'alerta');
            }
        }
        return recarga;
    }
    async listarRecargas(limite = 10) {
        const recargas = await this.recargaRepo.findAll();
        return recargas.slice(0, limite);
    }
    async calcularEnergiaRestante() {
        let config = await this.obterConfiguracao();
        if (!config) {
            config = await this.energiaRepo.create({ numero_contador: 123456789, total_disponivel_kwh: 0, consumo_diario_kwh: 0 });
        }
        const estimativa = Number(config.total_disponivel_kwh - (config.consumo_diario_kwh * 7));
        return Math.max(0, Math.round(estimativa));
    }
    async atualizarConsumoDiario(consumo) {
        const config = await this.energiaRepo.findFirst();
        if (!config) {
            throw new Error('Configuracao de energia nao encontrada');
        }
        return this.energiaRepo.update({ consumo_diario_kwh: consumo });
    }
    async definirTotalDisponivel(novototal, perfil) {
        if (novototal < 0)
            throw new Error('O total nao pode ser negativo');
        const config = await this.obterConfiguracao();
        const atualizado = await this.energiaRepo.definirTotalDisponivel({ consumo_diario_kwh: novototal });
        await this.atividadeService.registar(`Total disponivel alterado para: ${novototal} por : ${perfil}`, perfil);
        return atualizado;
    }
}
exports.EnergiaService = EnergiaService;
