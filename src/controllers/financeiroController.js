"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceiroController = void 0;
class FinanceiroController {
    //Get /api/jogos?configuracao
    async ganhoDia(req, res, next) {
        try {
            const service = req.app.locals.services.financeiroservice;
            const data = req.query.data || new Date().toISOString().split('T')[0];
            const ganho = await service.obterGanhoDia(data);
            res.json({ data, ganho });
        }
        catch (erro) {
            next(erro);
        }
    }
    //get anyone
    async ganhoSemana(req, res, next) {
        try {
            const service = req.app.locals.services.financeiroservice;
            const ganho = await service.obterGanhoSemana();
            res.json({ ganho });
        }
        catch (erro) {
            next(erro);
        }
    }
    //get
    async ganhoMes(req, res, next) {
        try {
            const service = req.app.locals.services.financeiroservice;
            const ganho = await service.obterGanhoMes();
            return res.json({ ganho });
        }
        catch (erro) {
            throw new Error(erro.message);
            next(erro);
        }
    }
    //get /api/financeiro/historico?limite=30
    async historico(req, res, next) {
        try {
            const service = req.app.locals.services.financeiroservice;
            const limite = req.query.limite ? Number(req.query.limite) : 30;
            const historico = await service.listarGanhosDiarios(limite);
            res.json({ historico });
        }
        catch (erro) {
            next(erro);
        }
    }
}
exports.FinanceiroController = FinanceiroController;
