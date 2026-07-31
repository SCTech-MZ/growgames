import { Request,Response,NextFunction } from "express";


export class AuthController{

    async verificarToken(req:Request, res:Response, next:NextFunction) {
        try {
            const { UsuarioRepository } = require('../repositories/usuarioRepositoRy');
            const usuarioRepo2 = new UsuarioRepository();
            const usuario = await usuarioRepo2.findById(req.userId!);
            const usuarioRepo = req.app.locals.services.usuarioAuthservice ? usuario.perfil : usuario.perfil;
            console.log(usuarioRepo)

            if (!usuario) {
                return res.status(404).json({ erro: "Usuario nao encontrado" });
            }

            return res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuarioRepo});
        } catch (erro) {
            next(erro);
            console.log("deu erro na verificacao do token")
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            // testes
            console.log('Headers:', req.headers);
            console.log('Body:', req.body);
            console.log('content-Type:', req.headers['content-type'])
            

            const { email, senha } = req.body;
            if (!email || !senha) {
                return res.status(400).json({ erro: 'Email e senha sao obrigatorios' });
            }

            const authService = req.app.locals.services.usuarioAuthservice;
            if (!authService) {
                console.error('Authservice nao enconrado no app.locals');
                return res.status(500).json({erro:'Servico de autenticacao nao configurado'})
            }

            const resultado = await authService.login(email, senha);
            res.json(resultado);


        } catch (erro:any) {
            if (erro.message === 'Credenciais invalidas') {
                return res.status(401).json({ erro: 'Email ou senha incorretos' });
            }
        }
    }
}