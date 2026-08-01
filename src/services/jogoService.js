"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JogoService = void 0;
class JogoService {
    constructor(jogoRepo, ganhodiarioRepo, notificacaoService, atividadeService) {
        this.jogoRepo = jogoRepo;
        this.ganhodiarioRepo = ganhodiarioRepo;
        this.notificacaoService = notificacaoService;
        this.atividadeService = atividadeService;
    }
    async registar(nomeJogo, quantidade, valorporjogo, data, perfil) {
        if (!nomeJogo || quantidade <= 0 || valorporjogo <= 0) {
            throw new Error('Dados invalidos para registro de jogo.');
        }
        const jogo = await this.jogoRepo.create({ jogo: nomeJogo, quantidade: quantidade, valor_por_jogo: valorporjogo, data });
        await this.ganhodiarioRepo.upsert(data, jogo.total || (quantidade * valorporjogo));
        await this.atividadeService.registar(`Jogo registado: ${nomeJogo} (${quantidade}x) - ${jogo.total}MTS`, perfil);
        if ((jogo.total || 0) > 1500) {
            await this.notificacaoService.criar(`Jogo "${nomeJogo}" gerou ${jogo.total}MTS em ${data}`, 'info');
        }
        return jogo;
    }
    async remover(id, perfil) {
        const jogo = await this.jogoRepo.findById(id);
        if (!jogo)
            throw new Error('Registro de jogo nao encontrado');
        const totalRemover = jogo.total || (jogo.quantidade * jogo.valor_por_jogo);
        await this.ganhodiarioRepo.upsert(jogo.data, -totalRemover);
        await this.jogoRepo.delete(id);
        await this.atividadeService.registar(`Jogo removido: ${jogo.jogo} ${jogo.data}`, perfil);
    }
    async listarPorData(data) {
        return this.jogoRepo.listarPorData(data);
    }
    async obterTotalDia(data) {
        return this.jogoRepo.totalPorData(data);
    }
    async listarGanhosAgrupados(dias = 30) {
        return this.jogoRepo.ganhosAgrupados(dias);
    }
}
exports.JogoService = JogoService;
