"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    async verificarToken(req, res, next) {
        try {
            const { UsuarioRepository } = require('../repositories/usuarioRepositoRy');
            const usuarioRepo2 = new UsuarioRepository();
            const usuario = await usuarioRepo2.findById(req.userId);
            const usuarioRepo = req.app.locals.services.usuarioAuthservice ? usuario.perfil : usuario.perfil;
            if (!usuario) {
                return res.status(404).json({ erro: "Usuario nao encontrado" });
            }
            return res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuarioRepo });
        }
        catch (erro) {
            next(erro);
            console.log("deu erro na verificacao do token");
        }
    }
    async login(req, res, next) {
        try {
            const { email, senha } = req.body;
            if (!email || !senha) {
                return res.status(400).json({ erro: 'Email e senha sao obrigatorios' });
            }
            const authService = req.app.locals.services.usuarioAuthservice;
            if (!authService) {
                console.error('Authservice nao enconrado no app.locals');
                return res.status(500).json({ erro: 'Servico de autenticacao nao configurado' });
            }
            const resultado = await authService.login(email, senha);
            res.json(resultado);
        }
        catch (erro) {
            if (erro.message === 'Credenciais invalidas') {
                return res.status(401).json({ erro: 'Email ou senha incorretos' });
            }
        }
    }
    async cadastro(req, res, next) {
        try {
            const { nome, email, senha, perfil } = req.body;
            if (!nome || !email || !senha || !perfil) {
                return res.status(400).json({ erro: "Nome,Email,Senha e perfil sao obrigatorios" });
            }
            if (!['admin', 'super'].includes(perfil)) {
                return res.status(401).json({ erro: "Perfil deve ser especificado..." });
            }
            if (senha.lenght < 6) {
                return res.status(400).json({ erro: "A senha deve ter pelo menos 4 caracteres" });
            }
            const authService = req.app.locals.usuarioAuthservice;
            const resultado = await authService.cadastro({ nome, email, senha, perfil });
            res.status(201).json({ mensagem: "Usuario cadastrado com sucesso", usuario: authService });
        }
        catch (erro) {
            if (erro.message === 'E-mail ja cadastrado') {
                return res.status(409).json({ erro: erro.message });
            }
        }
    }
}
exports.AuthController = AuthController;
