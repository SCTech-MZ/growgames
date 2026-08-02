import { Router } from "express";
import aparelhoRoute from './aparelhoRoute.js';
import energiRouter from './energiRouter.js';
import finnceiroRouter from './financeiroRouter.js'
import jogoRouter from './jogoRouter.js';
import notificacoesRouter from './notificacoesRouter.js';
import authRouter from './authRouter.js';
import pool  from '../database/postgre.js';


const router = Router();


router.use('/auth', authRouter);
router.use('/aparelhos', aparelhoRoute);
router.use('/energia', energiRouter);
router.use('/financeiro', finnceiroRouter);
router.use('/jogos', jogoRouter);
router.use('/notificacoes', notificacoesRouter);


export default router;
