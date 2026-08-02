import express from "express";
import cors from 'cors';
import { config } from "dotenv";
import pool  from "./database/postgre.js";
import app from './app.js';


const main = async () => {
    config();

    const port = process.env.PORT

    pool;

    app.listen(port, () => {
        console.log(`Rodando na porta ${port}`)
    })
   
}

main()