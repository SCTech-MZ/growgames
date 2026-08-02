import { GanhoDiarioRepository } from "../repositories/ganhoDiarioRepositorio.js";
import { JogoRepository } from "../repositories/jogoReoisitory.js";

export class FinanceiroService{
    constructor(private ganhoDiarioREpo:GanhoDiarioRepository,private jogoRepo:JogoRepository){}

    // async obterGanhosDiarios(limite: number = 30): Promise<{ data: string; total: number }[]>{
    async obterGanhoDia(data:string): Promise<number>{
        const ganhos = await this.ganhoDiarioREpo.getPorData(data);
        return ganhos ? (ganhos.total): 0;
    }
    
    
    async obterGanhoSemana(): Promise<number>{
        const hoje = new Date();
        const seteDiasAtras = new Date(hoje);
        seteDiasAtras.setDate(hoje.getDate() - 6);


        const inicio = seteDiasAtras.toISOString().split('T')[0];
        const fim = hoje.toISOString().split('T')[0];

        const ganhos = await this.ganhoDiarioREpo.ganhosPeriodico(inicio, fim);
        return ganhos.reduce((sum, g) => sum + Number(g.total), 0);
    }

    async obterGanhoMes(): Promise<number>{
        const hoje = new Date();
        const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const inicio = primeiroDia.toISOString().split('T')[0];
        const fim = hoje.toISOString().split('T')[0];

        const ganhos = await this.ganhoDiarioREpo.ganhosPeriodico(inicio,fim);
        
        return ganhos.reduce((sum, g) => sum + Number(g.total), 0);
    }
    
    async listarGanhosDiarios(limite: number = 30): Promise<{ data: string; total: number; }[]>{
        const ganhos = await this.ganhoDiarioREpo.ganhosPeriodico('2026-01-01', new Date().toISOString().split('T')[0]);
        
        return ganhos.map(g => ({ data: g.data, total: Number(g.total) })).slice(0, limite);
    }

}