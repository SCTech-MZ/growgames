import pool from "../database/postgre.js";
import { IJogo } from "../interface/IJogo.js";
import { BaseRepository } from "./baseRepository.js";


export class JogoRepository extends BaseRepository<IJogo>{
    constructor() {
        super('jogos_do_dia');
    }

    async listarPorData(data: string): Promise<any>{
        const rows = await pool.query('SELECT * FROM jogos_do_dia WHERE data = $1 ORDER BY created_at', [data]);
        return rows.rows;
    }

    async totalPorData(data: string): Promise<number>{
        const { rows } = await pool.query('SELECT COALESCE(SUM(total),0) as total FROM jogos_do_dia WHERE data = $1', [data]);
        return parseFloat(rows[0].total) || 0;
    }

    async ganhosAgrupados(limiteDias: number = 30): Promise<{ data: string; total: number }[]>{
        const { rows } = await pool.query(`SELECT data, SUM(total) as total FROM jogos_do_dia WHERE data >= CURRENT_DATE - INTERVAL '${limiteDias} days' GROUP BY data ORDER BY data DESC`);
        return rows.map(row => ({
            data: row.data.toISOString().split('T')[0],
            total: parseFloat(row.total)
        }));
    }
}