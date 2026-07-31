export interface IAparelho{
    id?: number;
    nome: string;
    tipo: 'console' | 'desktop' | 'playstation';
    status: 'ok' | 'precisa manutencao' | 'estragado';
    precisa_manutencao?: Boolean;
    observacao?: string;
    ultima_manutencao?: string;
    uso_hoje?: number;
    created_at?: string;
}
// export interface IAparelho<T>{
//     findAll(): Promise<T[]>;
//     findById(id: number): Promise<T | null>;
//     create(dados: Partial<T>): Promise<T>;
//     update(id: number,data:Partial<T>): Promise<T>;
//     delete(id: number): Promise<void>;
// }