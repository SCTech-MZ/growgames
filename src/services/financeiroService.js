"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceiroService = void 0;
class FinanceiroService {
    constructor(ganhoDiarioREpo, jogoRepo) {
        this.ganhoDiarioREpo = ganhoDiarioREpo;
        this.jogoRepo = jogoRepo;
    }
    // async obterGanhosDiarios(limite: number = 30): Promise<{ data: string; total: number }[]>{
    async obterGanhoDia(data) {
        const ganhos = await this.ganhoDiarioREpo.getPorData(data);
        return ganhos ? (ganhos.total) : 0;
    }
    async obterGanhoSemana() {
        const hoje = new Date();
        const seteDiasAtras = new Date(hoje);
        seteDiasAtras.setDate(hoje.getDate() - 6);
        const inicio = seteDiasAtras.toISOString().split('T')[0];
        const fim = hoje.toISOString().split('T')[0];
        const ganhos = await this.ganhoDiarioREpo.ganhosPeriodico(inicio, fim);
        return ganhos.reduce((sum, g) => sum + Number(g.total), 0);
    }
    async obterGanhoMes() {
        const hoje = new Date();
        const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const inicio = primeiroDia.toISOString().split('T')[0];
        const fim = hoje.toISOString().split('T')[0];
        const ganhos = await this.ganhoDiarioREpo.ganhosPeriodico(inicio, fim);
        return ganhos.reduce((sum, g) => sum + Number(g.total), 0);
    }
    async listarGanhosDiarios(limite = 30) {
        const ganhos = await this.ganhoDiarioREpo.ganhosPeriodico('2026-01-01', new Date().toISOString().split('T')[0]);
        return ganhos.map(g => ({ data: g.data, total: Number(g.total) })).slice(0, limite);
    }
}
exports.FinanceiroService = FinanceiroService;
