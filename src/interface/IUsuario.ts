export type UserRole = 'super' | 'admin';

export interface IUsuario{
    id: number;
    nome: string;
    email: string;
    senha_hash: string;
    perfil: UserRole;
    ativo: boolean;
    criado_em: string;
}