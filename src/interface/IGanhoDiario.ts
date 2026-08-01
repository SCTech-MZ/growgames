export interface IGanhoDiario{
    data: string;
    total: number;
}
// export interface IGanhoDiario<T>{
//     findAll(): Promise<T>;
//     findById(id: number): Promise<T>;
//     create(id: number): Promise<T>;
//     update(data: Partial<T>, id: number): Promise<T>;
//     delete(id:number):Promise<void>
// }