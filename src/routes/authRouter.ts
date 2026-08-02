import { NextFunction, Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const router = Router();
const controller = new AuthController();

router.post("/login", (req, res, next: NextFunction) => controller.login(req, res, next));
router.get('/verificar',AuthMiddleware,(req,res,next)=>controller.verificarToken(req,res,next))
router.post('/cadastrar',(req,res,next)=>controller.cadastrar(req,res,next))

export default router;