import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if(!process.env.DATABASE_URL){
    throw new Error("DATABASE_URL nao definida no arquivo .env");
}

const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl:{ rejectUnauthorized:false},
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.on('connect',()=>{
    console.log("Conectado com sucesso ao neon database");
});
pool.on('error',(erro:any)=>{
    console.log("Falha na conexao", erro.message);
});


export default pool;
