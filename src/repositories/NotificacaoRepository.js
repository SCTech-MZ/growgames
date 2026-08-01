"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificacaoRepository = void 0;
const postgre_1 = __importDefault(require("../database/postgre"));
const baseRepository_1 = require("./baseRepository");
class notificacaoRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super('notificacoes');
    }
    async findNaoLidas() {
        const { rows } = await postgre_1.default.query('SELECT * FROM notificacoes SET lida = false ORDER BY data_criacao DESC');
        return rows;
    }
    async marcartodascomolidas() {
        await postgre_1.default.query('UPDATE notificacoes SET lida = true WHERE lida = false');
    }
    async contarNaoLidas() {
        const { rows } = await postgre_1.default.query('SELECT COUNT(*)::int as count FROM notificacoes WHERE lida = true');
        return rows[0].count;
    }
}
exports.notificacaoRepository = notificacaoRepository;
