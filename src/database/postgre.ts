import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString:process.env.DABASE_URL,
    ssl:{ rejectUnauthorized:false},
    max:5,
});

pool.on('connect',()=>{
    console.log("Conectado com sucesso");
});
pool.on('error',(erro:any)=>{
    console.log("Falha na conexao", erro.message);
});


export default pool;
