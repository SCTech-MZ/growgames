"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgre_1 = __importDefault(require("../database/postgre"));
async function dadosTeste() {
    // energia
    await postgre_1.default.query(`INSERT INTO energia (numero_contador, total_disponivel_kwh,consumo_diario_kwh) VALUES('125678654990',1500,80)`);
    // aparelhos
    await postgre_1.default.query(`INSERT INTO aparelhos(nome,tipo,status,precisa_manutencao,observacao, uso_hoje) VALUES('pc 1','Desktop','ok',false,'',8)`);
    console.log("Dados incluidos with sucess");
}
async function seed() {
    // const senha_hash = await bcrypt.hash('12345678', 10);
    // await pool.query(
    //   `INSERT INTO usuarios(nome,email,senha_hash,perfil) VALUES('ultra admin','creator@gmail.com',$1,'super'),('um pouco admin','creator2@gmail.com',$1,'admin')`,[senha_hash]
    // );
    try {
        console.log("Inserindo os data");
        await dadosTeste();
        process.exit(0);
    }
    catch (erro) {
    }
    console.log('Feito');
}
seed().catch(console.error);
