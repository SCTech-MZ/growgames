import { IJogo } from "../interface/IJogo";
import { GanhoDiarioRepository } from "../repositories/ganhoDiarioRepositorio";
import { JogoRepository } from "../repositories/jogoReoisitory";
import { AtividadeService } from "./atividadeService";
import { NotificacaoService } from "./notificacaoService";

export class JogoService{
    constructor(
        private jogoRepo: JogoRepository,
        private ganhodiarioRepo: GanhoDiarioRepository,
        private notificacaoService: NotificacaoService,
        private atividadeService: AtividadeService) { }
    
    async registar(nomeJogo: string, quantidade: number, valorporjogo: number, data: string, perfil: string): Promise<IJogo>{
        if (!nomeJogo || quantidade <= 0 || valorporjogo <= 0) {
            throw new Error('Dados invalidos para registro de jogo.')
        }

        const jogo = await this.jogoRepo.create({ jogo: nomeJogo, quantidade: quantidade, valor_por_jogo: valorporjogo, data });

        await this.ganhodiarioRepo.upsert(data, jogo.total || (quantidade * valorporjogo));

        await this.atividadeService.registar(`Jogo registado: ${nomeJogo} (${quantidade}x) - ${jogo.total}MTS`, perfil);

        if ((jogo.total || 0) > 1500) {
            await this.notificacaoService.criar(`Jogo "${nomeJogo}" gerou ${jogo.total}MTS em ${data}`, 'info');
        }
        return jogo;
    }

    async remover(id: number,perfil:string): Promise<void>{
        const jogo = await this.jogoRepo.findById(id);
        if (!jogo) throw new Error('Registro de jogo nao encontrado');

        const totalRemover = jogo.total || (jogo.quantidade * jogo.valor_por_jogo);
        await this.ganhodiarioRepo.upsert(jogo.data, -totalRemover);

        await this.jogoRepo.delete(id);

        await this.atividadeService.registar(`Jogo removido: ${jogo.jogo} ${jogo.data}`,perfil);
    }

    async listarPorData(data: string): Promise<number>{
        return this.jogoRepo.listarPorData(data);
    }
    async obterTotalDia(data: string): Promise<number>{
        return this.jogoRepo.totalPorData(data);
    }
    async listarGanhosAgrupados(dias: number = 30): Promise<{ data: string;  total: number}[]>{
        return this.jogoRepo.ganhosAgrupados(dias);
    }
}

