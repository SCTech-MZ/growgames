"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergiaController = void 0;
class EnergiaController {
    //Get /api/energia/configuracao
    async obterConfiguracao(req, res, next) {
        try {
            const service = req.app.locals.services.energiaservice;
            const config = await service.obterConfiguracao();
            res.json(config || {});
        }
        catch (erro) {
            next(erro);
        }
    }
    //put (asata)
    async atualizarContador(req, res, next) {
        try {
            const service = req.app.locals.services.energiaservice;
            const { numero } = req.body;
            if (!numero) {
                return res.status(400).json({ erro: 'Numero de contador e obrigatorio' });
            }
            const atualizado = await service.atualizarContador(numero, req.perfil);
            res.json(atualizado);
        }
        catch (erro) {
            next(erro);
        }
    }
    async registarRecarga(req, res, next) {
        try {
            const service = req.app.locals.services.energiaservice;
            const { kwh, valor_pago } = req.body;
            if (!kwh || !valor_pago) {
                return res.status(400).json({ erro: Error });
            }
            const recarga = await service.registarRecarga(Number(kwh), Number(valor_pago), req.perfil);
            res.status(201).json(recarga);
        }
        catch (erro) {
            if (erro.message === 'Valores da recarga devem ser positivos') {
                return res.json(400).json({ erro: erro.message });
            }
            next(erro);
        }
    }
    async listarRecargas(req, res, next) {
        try {
            const service = req.app.locals.services.energiaservice;
            const limite = req.query.limite ? Number(req.query.limite) : 10;
            const recargas = await service.listarRecargas(limite);
            res.json(recargas);
        }
        catch (erro) {
            next(erro);
        }
    }
    async energiaRestante(req, res, next) {
        try {
            const service = req.app.locals.services.energiaservice;
            const restante = await service.calcularEnergiaRestante();
            res.json({ restante });
        }
        catch (erro) {
            next(erro);
        }
    }
    async definirTotalDisponivel(req, res, next) {
        try {
            const { data } = req.body;
            if (data === undefined) {
                return res.status(400).json({ erro: 'Informe o novo total em kwh' });
            }
            const service = req.app.locals.services.energiaservice;
            const resultado = await service.definirTotalDisponivel(Number(data), req.perfil);
        }
        catch (erro) {
            next(erro);
        }
    }
}
exports.EnergiaController = EnergiaController;
