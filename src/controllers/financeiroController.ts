import { Request,Response,NextFunction } from "express";

export class FinanceiroController{
    //Get /api/jogos?configuracao
    async ganhoDia(req: Request, res: Response, next: NextFunction) {
        try {
            const service = req.app.locals.services.financeiroservice;
            const data = req.query.data as string || new Date().toISOString().split('T')[0];
            const ganho = await service.obterGanhoDia(data);
            res.json({ data,ganho})
        } catch (erro) {
            next(erro)
        }
    }

    //get anyone
    async ganhoSemana(req: Request, res: Response, next: NextFunction) {
        try {
            const service = req.app.locals.services.financeiroservice;
            const ganho = await service.obterGanhoSemana();
            res.json({ ganho });
        } catch (erro) {
          next(erro);
        }
    }

    //get
    async ganhoMes(req: Request, res: Response, next: NextFunction) {
        try {
            const service = req.app.locals.services.financeiroservice;
            const ganho = await service.obterGanhoMes();
            return res.json({ganho});
        } catch (erro:any) {
            throw new Error(erro.message);
            next(erro)
        }
    }

    //get /api/financeiro/historico?limite=30
    async historico(req: Request, res: Response, next: NextFunction) {
        try {
            const service = req.app.locals.services.financeiroservice;
            const limite = req.query.limite ? Number(req.query.limite) : 30;
            const historico = await service.listarGanhosDiarios(limite);
          res.json({ historico});
        } catch (erro) {
          next(erro);
        }
    }
}