"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecargaRepository = void 0;
const postgre_1 = __importDefault(require("../database/postgre"));
const baseRepository_1 = require("./baseRepository");
class RecargaRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super('recarga_energia');
    }
    async findAllByDataRange(inicio, fim) {
        const { rows } = await postgre_1.default.query('SELECT * FROM recarga_energia WHERE data BETWEEN  $1 AND $2 ORDER BY data DESC', [inicio, fim]);
        return rows;
    }
    async gettotalRecarregado() {
        const { rows } = await postgre_1.default.query('SELECT COALESCE(SUM(valor_kwh),0) as total FROM recarga_energia');
        return parseFloat(rows[0].total);
    }
}
exports.RecargaRepository = RecargaRepository;
