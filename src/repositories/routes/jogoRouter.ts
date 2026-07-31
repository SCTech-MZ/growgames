import { Router } from "express";
import { jogoController } from "../../controllers/jogoController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const router = Router();
const controller = new jogoController();

router.get("/", AuthMiddleware, controller.listarPorData.bind(controller));
router.post("/", AuthMiddleware, controller.registrar.bind(controller));
router.delete("/:id", AuthMiddleware, controller.remover.bind(controller));
router.get("/total", AuthMiddleware, controller.totalDia.bind(controller));
router.get(
  "/ganhos-agrupados",
  AuthMiddleware,
  controller.ganhosAgrupados.bind(controller),
);

export default router;
