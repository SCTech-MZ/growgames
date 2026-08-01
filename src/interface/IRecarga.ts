export interface IRecarga{
    id: string;
    data: string;
    valor_kwh: number;
    valor_pago: number;
    created_at?: string;
}
// export interface IRecarga<T>{
//     findAll(): Promise<T>;
//     findById(id:number): Promise<T>;
//     create(id: number): Promise<T>;
//     update(data: Partial<T>, id: number): Promise<T>;
//     delete(id: number): Promise<void>;
// }