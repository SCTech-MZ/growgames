export interface IJogo{
    id: string;
    jogo: string;
    quantidade: number;
    valor_por_jogo: number;
    total?: number;
    data: string;
    created_at?: string;
}
// export interface IJogo<T>{
//     findAll(): Promise<T>;
//     findById(id: number): Promise<T>;
//     create(id: number): Promise<T>;
//     update(data: Partial<T>, id: number): Promise<T>;
//     delete(id: number): Promise<void>;
// }