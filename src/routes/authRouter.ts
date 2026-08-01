import { NextFunction, Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();
const controller = new AuthController();

router.post("/login", (req, res, next: NextFunction) => controller.login(req, res, next));
router.get('/verificar', AuthMiddleware, (req, res, next) => controller.verificarToken(req, res, next));
router.post('/cadastrar', controller.cadastro.bind(controller));

export default router;