import bycript from 'bcrypt'
import Jwt from 'jsonwebtoken'
import { UsuarioRepository } from '../repositories/usuarioRepositoRy'
import { IUsuario } from '../interface/IUsuario';


export class AuthUserService{
    constructor(private userRepo: UsuarioRepository) { }
    
    async login(email: string, senha: string): Promise<{ token: string; usuario: { id: number; nome: string; email: string; perfil: string } }> {
        const usuario = await this.userRepo.findByEmail(email);
        if (!usuario || !usuario.ativo) {
            throw new Error('Credenciais invalidas');
        }
        const senhaValida = await bycript.compare(senha, usuario.senha_hash);
        if (!senhaValida) {
            throw new Error('Credenciais invalidas');
        }
        const payload = { id: usuario.id, email: usuario.email, perfil: usuario.perfil };
        const token = Jwt.sign(payload, process.env.JWT_SECRET || 'growgamesecret', {
            expiresIn: '16h'
        });
        return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil } }; 
    }
    async cadastro(dados: { nome: string; email: string; senha: string; perfil: 'admin' | 'super' }): Promise<Omit<IUsuario, 'senha_hash'>>{
        const existente = await this.userRepo.findByEmail(dados.email);
        if (existente) {
            throw new Error("E-mail ja cadastrado");
        }
        const senha_hash = await bycript.hash(dados.senha, 10);

        const novoUsuario = await this.userRepo.cadastro({ nome: dados.nome, email: dados.email, senha_hash, perfil: dados.perfil });

        const { senha_hash: _, ...usuariosemhash } = novoUsuario;
        return usuariosemhash;
    }
}