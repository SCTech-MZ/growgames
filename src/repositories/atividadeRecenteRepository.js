"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtividadeRecenteRepository = void 0;
const postgre_1 = __importDefault(require("../database/postgre"));
const baseRepository_1 = require("./baseRepository");
class AtividadeRecenteRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super('atividade_recente');
    }
    async getUltimas(limite = 10) {
        const { rows } = await postgre_1.default.query('SELECT * FROM atividade_recente ORDERBY data_criacao DESC LIMIT $1', [limite]);
        return rows;
    }
}
exports.AtividadeRecenteRepository = AtividadeRecenteRepository;
