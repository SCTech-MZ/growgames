"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AparelhoService = void 0;
class AparelhoService {
    constructor(aparelhorepo, notificacaoservice, atividadeService) {
        this.aparelhorepo = aparelhorepo;
        this.notificacaoservice = notificacaoservice;
        this.atividadeService = atividadeService;
    }
    async listar() {
        return this.aparelhorepo.findAll();
    }
    async findById(id) {
        return this.aparelhorepo.findById(id);
    }
    async create(dados, perfil) {
        const aparelho = await this.aparelhorepo.create({ nome: dados.nome, tipo: dados.tipo || 'playstation', status: dados.status || 'ok', observacao: dados.observacao || '', precisa_manutencao: dados.precisa_manutencao ?? false, ultima_manutencao: new Date().toISOString().split('T')[0], uso_hoje: 0 });
        await this.atividadeService.registar(`Super admin cadastrou novo aparelho ${aparelho.nome}`, perfil);
        await this.notificacaoservice.criar(`Novo aparelho ${aparelho.nome} adicionado a lista.`, 'info');
        return aparelho;
    }
    async update(id, dados, perfil) {
        const existe = await this.aparelhorepo.findById(id);
        if (!existe) {
            throw new Error('Aparelho nao encontrado');
        }
        const atualizado = await this.aparelhorepo.update(id, { nome: dados.nome ?? existe.nome, tipo: dados.tipo ?? existe.tipo, status: dados.status ?? existe.status, precisa_manutencao: dados.precisa_manutencao ?? existe.precisa_manutencao, observacao: dados.observacao ?? existe.observacao, ultima_manutencao: dados.ultima_manutencao ?? existe.ultima_manutencao, uso_hoje: dados.uso_hoje ?? existe.uso_hoje });
        await this.atividadeService.registar(`Super admin Atualizou ${atualizado.nome}`, perfil);
        if (atualizado.precisa_manutencao && !existe.precisa_manutencao) {
            await this.notificacaoservice.criar(`${atualizado.nome} Precisa manutencao!`, 'alerta');
        }
        return atualizado;
    }
    async remover(id, perfil) {
        const aparelho = await this.aparelhorepo.findById(id);
        if (!aparelho)
            throw new Error("Aparelho nao encontraddo");
        await this.aparelhorepo.delete(id);
        await this.atividadeService.registar(`Super admin removeu aparelho: ${aparelho.nome}`, perfil);
    }
    async listarPrecisaManutencao() {
        return this.aparelhorepo.FindPrecisaManutencao();
    }
}
exports.AparelhoService = AparelhoService;
