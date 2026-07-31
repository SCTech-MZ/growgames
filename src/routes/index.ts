import { Router } from "express";
import aparelhoRoute from './aparelhoRoute';
import energiRouter from './energiRouter';
import finnceiroRouter from './financeiroRouter'
import jogoRouter from './jogoRouter';
import notificacoesRouter from './notificacoesRouter';
import authRouter from './authRouter';
import pool  from "../database/postgre";


const router = Router();

router.get('/', (req, res) => {
    res.json({
        mensagem: 'API Grow Games',
        status: 'Online'
    });
});

router.get('/diag', async (require, res) => {
    try {
        const { rows } = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`);
        const tabelas = rows.map(e => e.table_name);

        res.json({ status: 'ok', tabelas_existentes: tabelas, total_tabelas: tabelas.length });
    } catch (erro:any) {
        res.status(500).json({erro:erro.message})
    }
})


router.use('/auth', authRouter);
router.use('/aparelhos', aparelhoRoute);
router.use('/energia', energiRouter);
router.use('/financeiro', finnceiroRouter);
router.use('/jogos', jogoRouter);
router.use('/notificacoes', notificacoesRouter);


export default router;