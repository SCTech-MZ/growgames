"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
});
pool.on('connect', () => {
    console.log("CONectado com sucesso");
});
pool.on('error', (erro) => {
    console.log("Falha na conexao", erro.message);
});
exports.default = pool;
