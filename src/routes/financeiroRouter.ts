import { Router } from "express";
import { FinanceiroController } from "../controllers/financeiroController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();
const controller = new FinanceiroController();

router.get("/dia", AuthMiddleware, controller.ganhoDia.bind(controller));
router.get("/semana", AuthMiddleware, controller.ganhoSemana.bind(controller));
router.get("/mes", AuthMiddleware, controller.ganhoMes.bind(controller));
router.get("/historico", AuthMiddleware, controller.historico.bind(controller));

router.get('/tst',(req,res)=>{res.send("Hello World")})//teste

export default router;