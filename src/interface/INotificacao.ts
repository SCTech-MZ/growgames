export interface INotifcacao{
    id: number;
    mensagem: string;
    tipo: 'info' | 'aviso' | 'perigo';
    lida: boolean;
    data_criacao: string;
     
}
// export interface INotifcacao<T>{
//     findAll(): Promise<T>;
//     findById(id: number): Promise<T>;
//     create( id: number): Promise<T>;
//     update(data: Partial<T>, id: number): Promise<T>;
//     delete(id:number):Promise<void>
// }