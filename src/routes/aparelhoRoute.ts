import { Router,Request,Response,NextFunction } from "express";
import { AparelhoController } from "../controllers/AparelhoController.js";
import { AuthMiddleware, superAdminOnly } from "../middlewares/AuthMiddleware.js";

const router = Router();

const controller = new AparelhoController();

router.get("/", AuthMiddleware, (req: Request, res: Response, next: NextFunction) =>
  controller.listar(req, res, next),
);
router.get("/:id", AuthMiddleware, (req: Request, res: Response, next: NextFunction) =>
  controller.BuscarPorId(req, res, next),
);
router.post("/", AuthMiddleware, superAdminOnly, (req: Request, res: Response, next: NextFunction) =>
  controller.create(req, res, next),
);
router.put("/:id", AuthMiddleware, (req, res, next) =>
  controller.update(req, res, next),
);
router.delete("/:id", AuthMiddleware, superAdminOnly, (req: Request, res: Response, next: NextFunction) =>
  controller.remover(req, res, next),
);

export default router;
