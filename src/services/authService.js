"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthUserService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async login(email, senha) {
        const usuario = await this.userRepo.findByEmail(email);
        if (!usuario || !usuario.ativo) {
            throw new Error('Credenciais invalidas');
        }
        const senhaValida = await bcrypt_1.default.compare(senha, usuario.senha_hash);
        if (!senhaValida) {
            throw new Error('Credenciais invalidas');
        }
        const payload = { id: usuario.id, email: usuario.email, perfil: usuario.perfil };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'growgamesecret', {
            expiresIn: '16h'
        });
        return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil } };
    }
    async cadastro(dados) {
        const existente = await this.userRepo.findByEmail(dados.email);
        if (existente) {
            throw new Error("E-mail ja cadastrado");
        }
        const senha_hash = await bcrypt_1.default.hash(dados.senha, 10);
        const novoUsuario = await this.userRepo.cadastro({ nome: dados.nome, email: dados.email, senha_hash, perfil: dados.perfil });
        const { senha_hash: _, ...usuariosemhash } = novoUsuario;
        return usuariosemhash;
    }
}
exports.AuthUserService = AuthUserService;
