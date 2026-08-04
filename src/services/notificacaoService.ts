import { INotifcacao } from "../interface/INotificacao.js";
import { notificacaoRepository } from "../repositories/NotificacaoRepository.js";

export class NotificacaoService {
  constructor(private notificacaoRepo: notificacaoRepository) {}

  async criar(mensagem: string, tipo: "info" | "alerta" | "perigo" = "info") {
    return this.notificacaoRepo.create({
      mensagem,
      tipo: "info",
      lida: false,
    } as any);
  }

  async marcartodascomolidas(): Promise<void> {
    await this.notificacaoRepo.marcartodascomolidas();
  }

  async findNaoLidas(): Promise<INotifcacao[]> {
    return this.notificacaoRepo.findNaoLidas();
  }

  async contarNaoLidas(): Promise<number> {
    return this.notificacaoRepo.contarNaoLidas();
  }
}