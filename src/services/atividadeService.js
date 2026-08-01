"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtividadeService = void 0;
class AtividadeService {
    constructor(atividadeRepo) {
        this.atividadeRepo = atividadeRepo;
    }
    async registar(acao, perfil) {
        return this.atividadeRepo.create({ acao, perfil, data_criacao: new Date().toISOString() });
    }
    async listarUltimas(limite = 10) {
        return this.atividadeRepo.getUltimas(limite);
    }
}
exports.AtividadeService = AtividadeService;
