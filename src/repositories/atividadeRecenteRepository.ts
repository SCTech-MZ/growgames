import pool from "../database/postgre";
import { IAtividadeRecente } from "../interface/IAtividadeRecente";
import { BaseRepository } from "./baseRepository";


export class AtividadeRecenteRepository extends BaseRepository<IAtividadeRecente>{
    constructor() {
        super('atividade_recente');
    }

    async getUltimas(limite: number = 10): Promise<IAtividadeRecente[]>{
        const { rows } = await pool.query('SELECT * FROM atividade_recente ORDERBY data_criacao DESC LIMIT $1', [limite]);
        return rows;
    }
}