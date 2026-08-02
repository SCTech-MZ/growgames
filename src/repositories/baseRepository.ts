import { QueryResult } from "pg";
import pool  from "../database/postgre.js";
import { IRepository } from "../interface/Irepositoey.js";

export abstract class BaseRepository<T> implements IRepository<T>{
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }


    async findAll():Promise<T[]> {
        const { rows } = await pool.query(`SELECT * FROM ${this.tableName} ORDER BY id`);
        return rows;
    }

    async findById(id: number): Promise<T | null>{
        const { rows } = await pool.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return rows[0] || null;
    }

    async create(data: Partial<T>): Promise<T>{
        const keys = Object.keys(data as any);
        const values = Object.values(data as any);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const columns = keys.join(', ');

        const { rows } = await pool.query(`INSERT INTO ${this.tableName}(${columns}) VALUES(${placeholders}) RETURNING *`, values);
        return rows[0]
    }

    async update(id: number, data: Partial<T>): Promise<T>{
        const keys = Object.keys(data as any);
        const values = Object.values(data as any)
        const setClause = keys.map((key, i) => `${key} = ${i + 1}`).join(', ');
        
        const { rows } = await pool.query(`UPDATE ${this.tableName} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,[...values, id])
        return rows[0]
    }

    async delete(id: number): Promise<void> {
        await pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`,[id])
    }
}