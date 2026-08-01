import { Router } from "express";
import { EnergiaController } from "../controllers/energiacontroller";
import { AuthMiddleware, superAdminOnly } from "../middlewares/AuthMiddleware";

const router = Router();
const controller = new EnergiaController();

router.get(
  "/configuracao",
  AuthMiddleware,
  controller.obterConfiguracao.bind(controller),
);
router.put(
  "/contador",
  AuthMiddleware,
  controller.atualizarContador.bind(controller),
);
router.post(
  "/recargas",
  AuthMiddleware,
  superAdminOnly,
  controller.registarRecarga.bind(controller),
);
router.get(
  "/recargas",
  AuthMiddleware,
  controller.listarRecargas.bind(controller),
);
router.get(
  "/restante",
  AuthMiddleware,
  controller.energiaRestante.bind(controller),
);

router.put("/definir-total", AuthMiddleware, controller.definirTotalDisponivel.bind(controller));

export default router;
