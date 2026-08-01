export type role = 'super' | 'admin';

export interface userPayLoad{
    id: string;
    nome: string;
    email: string;
    password: string;
    perfil: role;

}