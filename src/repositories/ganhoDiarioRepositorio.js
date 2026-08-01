"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanhoDiarioRepository = void 0;
const postgre_1 = __importDefault(require("../database/postgre"));
class GanhoDiarioRepository {
    async upsert(data, total) {
        const { rows } = await postgre_1.default.query(`INSERT INTO ganhos_diarios (data,total) VALUES($1,$2) ON CONFLICT (data) DO UPDATE SET total = ganhos_diarios.total + $2 RETURNING *`, [data, total]);
        return rows[0];
    }
    async getPorData(data) {
        const { rows } = await postgre_1.default.query('SELECT * FROM ganhos_diarios WHERE data = $1', [data]);
        return rows[0] || null;
    }
    async ganhosPeriodico(inicio, fim) {
        const { rows } = await postgre_1.default.query('SELECT * FROM ganhos_diarios WHERE data BETWEEN $1 AND $2 ORDER BY data DESC', [inicio, fim]);
        return rows;
    }
    async ganhoMes(inicio, fim) {
        const { rows } = await postgre_1.default.query(`SELECT COALESCE(SUM(total), 0) as total_mes FROM ganhos_diarios WHERE data >= DATE_TRUNC('month', CURRENT_DATE) AND data < DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')`);
        return rows;
    }
}
exports.GanhoDiarioRepository = GanhoDiarioRepository;
