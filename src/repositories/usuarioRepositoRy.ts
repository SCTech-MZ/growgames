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

    async cadastro(data: Omit<IUsuario, 'id'| 'criado_em'>): Promise<IUsuario>{
        const {nome,email,senha_hash,perfil} = data
        const { rows } = await pool.query(`INSERT INTO usuarios(nome,email,senha_hash,perfil) VALUES($1,$2,$3,$4) RETURNING id,nome,email,perfil,ativo,criado_em`, [nome, email.toLowerCase().trim(), senha_hash, perfil]);
        return rows[0];
    }
}