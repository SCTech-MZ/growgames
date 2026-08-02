import pool from "../database/postgre.js";
import { INotifcacao } from "../interface/INotificacao.js";
import { BaseRepository } from "./baseRepository.js";


export class notificacaoRepository extends BaseRepository<INotifcacao>{
    constructor() {
        super('notificacoes')
    }

    async findNaoLidas(): Promise<INotifcacao[]>{
        const { rows } = await pool.query('SELECT * FROM notificacoes SET lida = false ORDER BY data_criacao DESC');
        return rows;
    }

    async marcartodascomolidas(): Promise<void>{
        await pool.query('UPDATE notificacoes SET lida = true WHERE lida = false');
    }

    async contarNaoLidas(): Promise<number>{
        const { rows } = await pool.query('SELECT COUNT(*)::int as count FROM notificacoes WHERE lida = true');
        return rows[0].count;
    }
}