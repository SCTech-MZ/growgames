import { Router } from "express";
import { AparelhoController } from "../controllers/AparelhoController";
import { AuthMiddleware, superAdminOnly } from "../middlewares/AuthMiddleware";

const router = Router();

const controller = new AparelhoController();

router.get("/", AuthMiddleware, (req, res, next) =>
  controller.listar(req, res, next),
);
router.get("/:id", AuthMiddleware, (req, res, next) =>
  controller.BuscarPorId(req, res, next),
);
router.post("/", AuthMiddleware, superAdminOnly, (req, res, next) =>
  controller.create(req, res, next),
);
router.put("/:id", AuthMiddleware, (req, res, next) =>
  controller.update(req, res, next),
);
router.delete("/:id", AuthMiddleware, superAdminOnly, (req, res, next) =>
  controller.remover(req, res, next),
);

export default router;
