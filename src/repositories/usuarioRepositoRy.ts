import pool from "../database/postgre";
import { IUsuario } from "../interface/IUsuario";


export class UsuarioRepository{
    async findByEmail(email: string): Promise<IUsuario | null>{
        const { rows } = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
        return rows[0] || null;
    }

    async findById(id: number): Promise<IUsuario>{
        const { rows } = await pool.query(`SELECT * FROM usuarios WHERE id = $1`, [id]);
        return rows[0] || null;
    }
}