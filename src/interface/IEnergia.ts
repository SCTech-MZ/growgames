export interface IEnergia{
    id: string;
    numero_contador: number;
    total_disponivel_kwh: number;
    consumo_diario_kwh: number;
}
// export interface IEnergia<T>{
//     findAll(): Promise<T>;
//     findById(id: number): Promise<T | null>;
//     create(id: number): Promise<T>;
//     update(data: Partial<T>, id: number): Promise<T>;
//     delete(id: number): Promise<void>;
// }