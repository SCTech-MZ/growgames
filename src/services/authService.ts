import bycript from 'bcrypt'
import Jwt from 'jsonwebtoken'
import { UsuarioRepository } from '../repositories/usuarioRepositoRy'


export class AuthUserService{
    constructor(private userRepo: UsuarioRepository) { }
    
    async login(email: string, senha: string): Promise<{ token: string; usuario: { id: number; nome: string; email: string; perfil: string } }> {
        {
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
        
    }
}