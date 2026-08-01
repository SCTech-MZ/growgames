"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AparelhoController = void 0;
class AparelhoController {
    // get /api/aparelhos
    async listar(req, res, next) {
        try {
            const service = req.app.locals.services.aparelhoservice;
            const aparelhos = await service.listar();
            res.json(aparelhos);
        }
        catch (erro) {
            next(erro);
        }
    }
    //get /api/aparelhos/:id
    async BuscarPorId(req, res, next) {
        try {
            const service = req.app.locals.services.aparelhoservice;
            const aparelho = await service.BuscarPorId(Number(req.params.id));
            if (!aparelho) {
                return res.status(404).json({ erro: 'Aparelho nao encontrado' });
            }
            res.json(aparelho);
        }
        catch (erro) {
            next(erro);
        }
    }
    //post /api/aparelhos(apenas super admin tem acess =[asata])
    // async create(req: Request, res: Response, next: NextFunction):Promise<IAparelho>{
    async create(req, res, next) {
        try {
            const service = req.app.locals.services.aparelhoservice;
            const perfil = req.perfil;
            const novoAparelho = await service.create(req.body, perfil);
            res.status(201).json(novoAparelho);
        }
        catch (erro) {
            next(erro);
        }
    }
    //put /api/aparelhos/:id(asata)
    async update(req, res, next) {
        try {
            const service = req.app.locals.services.aparelhoservice;
            const perfil = req.perfil;
            const atualizado = await service.update(Number(req.params.id), req.body, perfil);
            res.json(atualizado);
        }
        catch (erro) {
            if (erro.message === "Aparelho não encontrado") {
                return res.status(404).json({ erro: erro.message });
            }
            next(erro);
        }
    }
    //delete /api/aparelhos/:id(asata)
    async remover(req, res, next) {
        try {
            const service = req.app.locals.services.aparelhoservice;
            const perfil = req.perfil;
            await service.remover(Number(req.params.id), perfil);
            res.status(204).send();
        }
        catch (erro) {
            if (erro.message === "Aparelho não encontrado") {
                return res.status(404).json({ erro: erro.message });
            }
            next(erro);
        }
    }
}
exports.AparelhoController = AparelhoController;
