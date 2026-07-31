import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    host: 'localhost',
    port:5432,
    database:'growgame',
    user: 'postgres',
    password:'12345678'
});


pool.connect().then(() => {
    console.log("conexao realizada com sucess")
}).catch((erro) => {
    console.log(`conexao falhou porque: ${erro}`)
});

export default pool;