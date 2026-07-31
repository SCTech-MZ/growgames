import { Router } from "express";
import aparelhoRoute from './aparelhoRoute';
import energiRouter from './energiRouter';
import finnceiroRouter from './financeiroRouter'
import jogoRouter from './jogoRouter';
import notificacoesRouter from './notificacoesRouter';
import authRouter from './authRouter';
import pool  from "../database/postgre";


const router = Router();


router.use('/auth', authRouter);
router.use('/aparelhos', aparelhoRoute);
router.use('/energia', energiRouter);
router.use('/financeiro', finnceiroRouter);
router.use('/jogos', jogoRouter);
router.use('/notificacoes', notificacoesRouter);


export default router;
