import { IAtividadeRecente } from "../interface/IAtividadeRecente.js";
import { AtividadeRecenteRepository } from "../repositories/atividadeRecenteRepository.js";


export class AtividadeService{
    constructor(private atividadeRepo:AtividadeRecenteRepository){}

    async registar(acao: string, perfil: string): Promise<IAtividadeRecente>{
        return this.atividadeRepo.create({ acao, perfil, data_criacao: new Date().toISOString() } as any);
    }

    async listarUltimas(limite: number = 10): Promise<IAtividadeRecente[]>{
        return this.atividadeRepo.getUltimas(limite);
    }
}