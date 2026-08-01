"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const postgre_1 = __importDefault(require("../database/postgre"));
class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
    }
    async findAll() {
        const { rows } = await postgre_1.default.query(`SELECT * FROM ${this.tableName} ORDER BY id`);
        return rows;
    }
    async findById(id) {
        const { rows } = await postgre_1.default.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return rows[0] || null;
    }
    async create(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const columns = keys.join(', ');
        const { rows } = await postgre_1.default.query(`INSERT INTO ${this.tableName}(${columns}) VALUES(${placeholders}) RETURNING *`, values);
        return rows[0];
    }
    async update(id, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map((key, i) => `${key} = ${i + 1}`).join(', ');
        const { rows } = await postgre_1.default.query(`UPDATE ${this.tableName} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`, [...values, id]);
        return rows[0];
    }
    async delete(id) {
        await postgre_1.default.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
    }
}
exports.BaseRepository = BaseRepository;
