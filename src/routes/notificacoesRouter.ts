import { Router } from "express";
import { NotificacaoController } from "../controllers/notificacaoController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const router = Router();
const controller = new NotificacaoController();

router.get("/", AuthMiddleware, controller.listar.bind(controller));
router.put(
  "/marcar-lidas",
  AuthMiddleware,
  controller.marcartodascomolidas.bind(controller),
);
router.get(
  "/contagem",
  AuthMiddleware,
  controller.contarNaoLidas.bind(controller),
);

export default router;
