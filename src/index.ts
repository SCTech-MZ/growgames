import express from "express";
import cors from 'cors';
import { config } from "dotenv";
import pool  from "./database/postgre";
import app from './app'


const main = async () => {
    config();

    const port = process.env.PORT
}

main()