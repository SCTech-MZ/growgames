"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergiaRepository = void 0;
const postgre_1 = __importDefault(require("../database/postgre"));
class EnergiaRepository {
    async findFirst() {
        const { rows } = await postgre_1.default.query("SELECT * FROM energia");
        return rows[0] || null;
    }
    async update(data) {
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
        const { rows } = await postgre_1.default.query(`UPDATE energia SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`, [...values, exist.id]);
        return rows[0];
    }
    async create(data) {
        const { rows } = await postgre_1.default.query(`INSERT INTO energia (numero_contador,total_diaponivel_kwh,consumo_diario_kwh) VALUES($1,$2,$3) RETURNING *`, [data.numero_contador, data.total_disponivel_kwh, data.consumo_diario_kwh,]);
        return rows[0];
    }
    async definirTotalDisponivel(data) {
        const exist = await this.findFirst();
        if (!exist) {
            return this.create({ total_disponivel_kwh: data.total_disponivel_kwh });
        }
        const { rows } = await postgre_1.default.query(`UPDATE energia SET total_disponivel_kwh = $1 RETURNING total_disponivel_kwh`, [data.consumo_diario_kwh]);
        return rows[0];
    }
    async obterConfiguracao(data) {
        const { rows } = await postgre_1.default.query(`SELECT * FROM energia`);
        return rows[0];
    }
}
exports.EnergiaRepository = EnergiaRepository;
