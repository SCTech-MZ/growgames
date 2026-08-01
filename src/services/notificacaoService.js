"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacaoService = void 0;
class NotificacaoService {
    constructor(notificacaoRepo) {
        this.notificacaoRepo = notificacaoRepo;
    }
    async criar(mensagem, tipo = "info") {
        return this.notificacaoRepo.create({ mensagem, tipo: "info", lida: false });
    }
    async markAllASLidas() {
        await this.notificacaoRepo.marcartodascomolidas();
    }
    async listarNaoLidas() {
        return this.notificacaoRepo.findNaoLidas();
    }
    async contarNaoLidas() {
        return this.notificacaoRepo.contarNaoLidas();
    }
}
exports.NotificacaoService = NotificacaoService;
