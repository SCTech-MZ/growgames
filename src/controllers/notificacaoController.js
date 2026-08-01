"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacaoController = void 0;
class NotificacaoController {
    //Get /api/jogos?configuracao
    async listar(req, res, next) {
        try {
            const service = req.app.locals.services.notificacaoservice;
            const naoLidas = req.query.naoLidas === 'true';
            let notificacoes;
            if (naoLidas) {
                notificacoes = await service.contarNaoLidas();
            }
            else {
                notificacoes = await service.contarNaoLidas();
            }
            res.json(notificacoes);
        }
        catch (erro) {
            next(erro);
        }
    }
    //get /api/marcar-lidas
    async marcartodascomolidas(req, res, next) {
        try {
            const service = req.app.locals.services.notificacaoservice;
            await service.marcartodascomolidas();
            res.json({ sucess: true });
        }
        catch (error) {
            next(error);
        }
    }
    // put anyone
    async contarNaoLidas(req, res, next) {
        try {
            const service = req.app.locals.services.notificacaoservice;
            const contagem = await service.contarNaoLidas();
            res.json(contagem);
        }
        catch (erro) {
            return res.json({ erro: erro.message });
            next(erro);
        }
    }
}
exports.NotificacaoController = NotificacaoController;
