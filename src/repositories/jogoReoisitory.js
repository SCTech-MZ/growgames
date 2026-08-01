"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JogoRepository = void 0;
const postgre_1 = __importDefault(require("../database/postgre"));
const baseRepository_1 = require("./baseRepository");
class JogoRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super('jogos_do_dia');
    }
    async listarPorData(data) {
        const rows = await postgre_1.default.query('SELECT * FROM jogos_do_dia WHERE data = $1 ORDER BY created_at', [data]);
        return rows.rows;
    }
    async totalPorData(data) {
        const { rows } = await postgre_1.default.query('SELECT COALESCE(SUM(total),0) as total FROM jogos_do_dia WHERE data = $1', [data]);
        return parseFloat(rows[0].total) || 0;
    }
    async ganhosAgrupados(limiteDias = 30) {
        const { rows } = await postgre_1.default.query(`SELECT data, SUM(total) as total FROM jogos_do_dia WHERE data >= CURRENT_DATE - INTERVAL '${limiteDias} days' GROUP BY data ORDER BY data DESC`);
        return rows.map((row) => ({
            data: row.data.toISOString().split('T')[0],
            total: parseFloat(row.total)
        }));
    }
}
exports.JogoRepository = JogoRepository;
