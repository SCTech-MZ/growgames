import express from "express";
import cors from "cors";
import routes from "./routes/index";
import { ErrorHandler } from "./middlewares/ErrorHandler";




// imports de repos
import { AparelhoRepository } from "./repositories/aparelhoRepository";
import { EnergiaRepository } from "./repositories/energiaRepository";
import { JogoRepository } from "./repositories/jogoReoisitory";
import { notificacaoRepository } from "./repositories/NotificacaoRepository";
import { GanhoDiarioRepository } from "./repositories/ganhoDiarioRepositorio";
import { AtividadeRecenteRepository } from "./repositories/atividadeRecenteRepository";
import { RecargaRepository } from "./repositories/RecargaRepository";
import { UsuarioRepository } from "./repositories/usuarioRepositoRy";



// imports de services
import { AparelhoService } from "./services/AparelhoService";
import { AtividadeService } from "./services/atividadeService";
import { AuthUserService } from "./services/authService";
import { EnergiaService } from "./services/energiaService";
import { FinanceiroService } from "./services/financeiroService";
import { JogoService } from "./services/jogoService";
import { NotificacaoService } from "./services/notificacaoService";



// instanciar repositorios
const aparelhoRepo = new AparelhoRepository();
const energiaRepo = new EnergiaRepository();
const recargaRepo = new RecargaRepository();
const jogoRepo = new JogoRepository();
const notificacaoRepo = new notificacaoRepository();
const ganhoDiarioRepo = new GanhoDiarioRepository();
const atividadeRecenteRepo = new AtividadeRecenteRepository();
const usuarioRepo = new UsuarioRepository();

// instanciar servicos
const atividadeservice = new AtividadeService(atividadeRecenteRepo);
const notificacaoservice = new NotificacaoService(notificacaoRepo);
const aparelhoservice = new AparelhoService(aparelhoRepo,notificacaoservice,atividadeservice);
const energiaservice = new EnergiaService(energiaRepo,recargaRepo,notificacaoservice,atividadeservice);
const jogoservice = new JogoService(jogoRepo,ganhoDiarioRepo,notificacaoservice,atividadeservice);
const financeiroservice = new FinanceiroService(ganhoDiarioRepo, jogoRepo);
const usuarioAuthservice = new AuthUserService(usuarioRepo)




const app = express();


app.use(cors({origin:'*',methods:['GET','POST','PUT','DELETE','OPTIONS'],allowedHeaders:['Content-Type','Authorization']}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.locals.services = {
  usuarioAuthservice,
  aparelhoservice,
  energiaservice,
  jogoservice,
  financeiroservice,
  notificacaoservice,
  atividadeservice,
};

// rotas
app.use("/api", routes);



app.use(ErrorHandler);


export default app;
