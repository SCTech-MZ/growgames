import { Request,Response,NextFunction } from "express";

export class EnergiaController{
    //Get /api/energia/configuracao
    async obterConfiguracao(req: Request, res: Response, next: NextFunction) {
        try {
            const service = req.app.locals.services.energiaservice;
            const config = await service.obterConfiguracao();
                res.json(config || {})
        } catch (erro) {
            next(erro)
        }
    }

    //put (asata)
    async atualizarContador(req: Request, res: Response, next: NextFunction) {
        try {
          const service = req.app.locals.services.energiaservice;
            const { numero } = req.body;

            if (!numero) {
                return res.status(400).json({erro: 'Numero de contador e obrigatorio'});
            }
            const atualizado = await service.atualizarContador(numero, req.perfil!)
          res.json(atualizado);
        } catch (erro) {
          next(erro);
        }
    }

    async registarRecarga(req: Request, res: Response, next: NextFunction) {
        try {
            const service = req.app.locals.services.energiaservice;
            const { kwh, valor_pago } = req.body;
            if (!kwh || !valor_pago) {
                return res.status(400).json({erro:Error})
            }
            const recarga = await service.registarRecarga(Number(kwh), Number(valor_pago), req.perfil!);
            res.status(201).json(recarga);
        } catch (erro:any) {
            if (erro.message === 'Valores da recarga devem ser positivos') {
                return res.json(400).json({ erro: erro.message });
            }
            next(erro)
        }
    }

    async listarRecargas(req: Request, res: Response, next: NextFunction) {
        try {
            const service = req.app.locals.services.energiaservice;
            const limite = req.query.limite ? Number(req.query.limite) : 10;
            const recargas = await service.listarRecargas(limite);
            res.json(recargas);
        } catch (erro) {
            next(erro)
        }
    }

    async energiaRestante(req: Request, res: Response, next: NextFunction) {
        try {
            const service = req.app.locals.services.energiaservice;
            const restante = await service.calcularEnergiaRestante();
            res.json({ restante });
        } catch (erro) {
            next(erro);
        }
    }
    async definirTotalDisponivel(req: Request, res: Response, next: NextFunction) {
        try {
            const { data } = req.body;
            if (data === undefined) {
                return res.status(400).json({ erro: 'Informe o novo total em kwh' });
            }
            const service = req.app.locals.services.energiaservice;
            const resultado = await service.definirTotalDisponivel(Number(data), req.perfil!);
        } catch (erro:any) {
            next(erro)
        }
    }
}