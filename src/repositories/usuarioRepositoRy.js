"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepository = void 0;
const postgre_1 = __importDefault(require("../database/postgre"));
class UsuarioRepository {
    async findByEmail(email) {
        const { rows } = await postgre_1.default.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
        return rows[0] || null;
    }
    async findById(id) {
        const { rows } = await postgre_1.default.query(`SELECT * FROM usuarios WHERE id = $1`, [id]);
        return rows[0] || null;
    }
    async cadastro(data) {
        const { nome, email, senha_hash, perfil } = data;
        const { rows } = await postgre_1.default.query(`INSERT INTO usuarios(nome,email,senha_hash,perfil) VALUES($1,$2,$3,$4) RETURNING id,nome,email,perfil,ativo,criado_em`, [nome, email.toLowerCase().trim(), senha_hash, perfil]);
        return rows[0];
    }
}
exports.UsuarioRepository = UsuarioRepository;
