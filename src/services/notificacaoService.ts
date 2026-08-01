import { INotifcacao } from "../interface/INotificacao";
import { notificacaoRepository } from "../repositories/NotificacaoRepository";

export class NotificacaoService {
  constructor(private notificacaoRepo: notificacaoRepository) {}

  async criar(mensagem: string, tipo: "info" | "alerta" | "perigo" = "info") {
    return this.notificacaoRepo.create({ mensagem, tipo: "info", lida: false });
  }

  async markAllASLidas(): Promise<void> {
    await this.notificacaoRepo.marcartodascomolidas();
  }

  async listarNaoLidas(): Promise<INotifcacao[]> {
    return this.notificacaoRepo.findNaoLidas();
  }

  async contarNaoLidas(): Promise<number> {
    return this.notificacaoRepo.contarNaoLidas();
  }
}