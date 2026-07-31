import pool  from "../database/postgre";
import { IEnergia } from "../interface/IEnergia";


export class EnergiaRepository {
  async findFirst(): Promise<IEnergia | null> {
    const { rows } = await pool.query("SELECT * FROM energia");
    return rows[0] || null;
  }

  async update(data: Partial<IEnergia>): Promise<IEnergia> {
    const exist = await this.findFirst();
    if (!exist) {
      return this.create({
        numero_contador: data.numero_contador || 123456789,
        total_disponivel_kwh: data.total_disponivel_kwh || 0,
        consumo_diario_kwh: data.consumo_diario_kwh || 0,
      });
    }

    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key}= $${i + 1}`).join(", ");
    const { rows } = await pool.query(
      `UPDATE energia SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, exist.id],
    );
    return rows[0];
  }

  async create(data: Partial<IEnergia>): Promise<IEnergia> {
    const { rows } = await pool.query(
      `INSERT INTO energia (numero_contador,total_diaponivel_kwh,consumo_diario_kwh) VALUES($1,$2,$3) RETURNING *`,
      [data.numero_contador,data.total_disponivel_kwh,data.consumo_diario_kwh,],
    );
    return rows[0];
  }

  async definirTotalDisponivel(data: Partial<IEnergia>): Promise<IEnergia> {
    const exist = await this.findFirst();
    if (!exist) {
      return this.create({ total_disponivel_kwh: data.total_disponivel_kwh });
    }
    const { rows } = await pool.query(
      `UPDATE energia SET total_disponivel_kwh = $1 RETURNING total_disponivel_kwh`,
      [data.consumo_diario_kwh],
    );
    return rows[0];
  }

  async obterConfiguracao(data: Partial<IEnergia>): Promise<IEnergia> {
    const { rows } = await pool.query(`SELECT * FROM energia`);
    return rows[0];
  }
}