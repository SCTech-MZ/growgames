import { Request,Response,NextFunction } from "express";

export class jogoController{
    //Get /api/jogos?configuracao
    async listarPorData(req: Request, res: Response, next: NextFunction) {
        try {
            const service = req.app.locals.services.jogoservice;
            const data = req.query.data as string || new Date().toISOString().split('T')[0];
            const jogos = await service.listarPorData(data);
            res.json(jogos || {})
        } catch (erro) {
            next(erro)
        }
    }

    //post anyone
    async registrar(req: Request, res: Response, next: NextFunction) {
        try {
          const service = req.app.locals.services.jogoservice;
            const { nomeJogo, quantidade, valorporjogo, data } = req.body;

            if (!nomeJogo || !quantidade || !valorporjogo ) {
                return res.status(400).json({erro: 'Campos obrigatorios: nome, quantidade e valor'});
            }
            const datajogo = data || new Date().toISOString().split('T')[0];
            const jogo = await service.registar(nomeJogo, Number(quantidade), Number(valorporjogo), datajogo, req.perfil!);
            res.status(201).json(jogo);
        } catch (erro: any) {
            if (erro.message.includes("inválidos")) {
              return res.status(400).json({ erro: erro.message });
            }
          next(erro);
        }
    }

    //delete
    async remover(req: Request, res: Response, next: NextFunction) {
        try {
            const service = req.app.locals.services.jogoservice;
            await service.remover(Number(req.params.id), req.perfil!);
            return res.status(204).send();
        } catch (erro: any) {
            if (erro.message === "Registo de jogo não encontrado") {
              return res.status(404).json({ erro: erro.message });
            }
            next(erro)
        }
    }

    //get
    async totalDia(req: Request, res: Response, next: NextFunction) {
        try {
          const service = req.app.locals.services.jogoservice;
          const data = req.query.data as string || new Date().toISOString().split('T')[0];
          const total = await service.totalDia(data);
          res.json({ data, total});
        } catch (erro) {
          next(erro);
        }
    }
    //get
    async ganhosAgrupados(req: Request, res: Response, next: NextFunction) {
        try {
          const service = req.app.locals.services.jogoservice;
          const dias = req.query.dias ? Number(req.query.dias): 30;
          const agrupado = await service.ganhosAgrupados(dias);
          res.json(agrupado);
        } catch (erro) {
          next(erro);
        }
    }
}