import pool from "../database/postgre";
import { IGanhoDiario } from "../interface/IGanhoDiario";


export class GanhoDiarioRepository {
    async upsert(data: string, total: number): Promise<IGanhoDiario>{
        const { rows } = await pool.query(`INSERT INTO ganhos_diarios (data,total) VALUES($1,$2) ON CONFLICT (data) DO UPDATE SET total = ganhos_diarios.total + $2 RETURNING *`, [data, total]);
        return rows[0];
    }

    async getPorData(data: string): Promise<IGanhoDiario | null>{
        const { rows } = await pool.query('SELECT * FROM ganhos_diarios WHERE data = $1', [data]);
        return rows[0] || null;
    }

    async ganhosPeriodico(inicio: string, fim: string): Promise<IGanhoDiario[]>{
        const { rows } = await pool.query('SELECT * FROM ganhos_diarios WHERE data BETWEEN $1 AND $2 ORDER BY data DESC', [inicio, fim]);
        return rows;
    }

    async ganhoMes(inicio: string, fim: string): Promise<IGanhoDiario[]> {
        const { rows } = await pool.query(`SELECT COALESCE(SUM(total), 0) as total_mes FROM ganhos_diarios WHERE data >= DATE_TRUNC('month', CURRENT_DATE) AND data < DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')`);
        return rows;
    }
}