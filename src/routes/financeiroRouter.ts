import { Router } from "express";
import { FinanceiroController } from "../controllers/financeiroController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const router = Router();
const controller = new FinanceiroController();

router.get("/dia", AuthMiddleware, controller.ganhoDia.bind(controller));
router.get("/semana", AuthMiddleware, controller.ganhoSemana.bind(controller));
router.get("/mes", AuthMiddleware, controller.ganhoMes.bind(controller));
router.get("/historico", AuthMiddleware, controller.historico.bind(controller));

export default router;
