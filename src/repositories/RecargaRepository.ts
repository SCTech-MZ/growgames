import pool  from "../database/postgre";
import { IRecarga } from "../interface/IRecarga";
import { BaseRepository } from "./baseRepository";


export class RecargaRepository extends BaseRepository<IRecarga>{
    constructor() {
        super('recarga_energia')
    }

    async findAllByDataRange(inicio: string, fim: string): Promise<IRecarga[]>{
        const { rows } = await pool.query('SELECT * FROM recarga_energia WHERE data BETWEEN  $1 AND $2 ORDER BY data DESC', [inicio, fim]);
        return rows;
    }

    async gettotalRecarregado(): Promise<number>{
        const { rows } = await pool.query('SELECT COALESCE(SUM(valor_kwh),0) as total FROM recarga_energia');
        return parseFloat(rows[0].total);
    }
}