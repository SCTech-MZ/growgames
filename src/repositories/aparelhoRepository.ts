import pool  from "../database/postgre";
import { IAparelho } from "../interface/IAparelho";
import { BaseRepository } from "./baseRepository";


export class AparelhoRepository extends BaseRepository<IAparelho>{
    constructor() {
        super('aparelhos');
    }

    async findAll(): Promise<IAparelho[]> {
        const { rows } = await pool.query('SELECT * FROM aparelhos ORDER BY id');
        return rows;
    }

    async findById(id: number): Promise<IAparelho | null> {
        const { rows } = await pool.query(`SELECT * FROM aparelhos WHERE id = $1`, [id]);
        return rows[0] || null;
    }

    async FindPrecisaManutencao(): Promise<IAparelho[]> {
        const { rows } = await pool.query(`SELECT * FROM aparelhos WHERE prescisa_manutencao = true`);
        return rows;
    }

    async findByStatus(status: string): Promise<IAparelho>{
        const { rows } = await pool.query('SELECT * FROM aparelhos WHERE status = $1 ORDER BY id', [status]);
        return rows[0];
    }

    async create(data: Partial<IAparelho>): Promise<IAparelho> {
        const { nome, tipo = 'Desktop', status= 'ok', precisa_manutencao = false, observacao = '', uso_hoje = 0 } = data;
        const { rows } = await pool.query(`INSERT INTO aparelhos(nome,tipo,status,precisa_manutencao,observacao,ultima_manutencao,uso_hoje) VALUES($1,$2,$3,$4,$5,CURRENT_DATE,$6) RETURNING *`, [nome, tipo, status, precisa_manutencao, observacao, uso_hoje] );
        return rows[0];
    }

    async update(id: number, data: Partial<IAparelho>): Promise<IAparelho> {
        const aparelhoAtual = await this.findById(id);
        if (!aparelhoAtual) {
            throw new Error(`Aparelho com id: ${id}, nao encontrado`);
        }

        const campos = { nome: data.nome ?? aparelhoAtual.nome, tipo: data.tipo ?? aparelhoAtual.tipo, status: data.status ?? aparelhoAtual.status, precisa_manutencao: data.precisa_manutencao ?? aparelhoAtual.precisa_manutencao, observacao: data.observacao ?? aparelhoAtual.observacao, ultima_atualizacao: data.ultima_manutencao ?? aparelhoAtual.ultima_manutencao, uso_hoje: data.uso_hoje ?? aparelhoAtual.uso_hoje }
        
        const { rows } = await pool.query(`UPDATE aparelhos SET nome = $1, tipo = $2, status = $3, precisa_manutencao = $4, observacao = $5, ultima_manutencao = $6, uso_hoje = $7 WHERE id = $8 RETURNING *;`, [campos.nome, campos.tipo, campos.status, campos.precisa_manutencao, campos.observacao, campos.ultima_atualizacao, campos.uso_hoje, id]);
        return rows[0];
    }

    async delete(id: number): Promise<void> {
        const aparelho = await this.findById(id);
        if (!aparelho) {
            throw new Error(`Aparelho com id ${id}, nao encontrado`);
        }

        await pool.query(`DELETE FROM aparelhos WHERE id = $1`, [id]);
    }

    async marcarManutencao(id: number, observacao?: string): Promise<IAparelho>{
        const { rows } = await pool.query(`UPDATE aparelhos SET precisa_manutencao = true, status = 'aviso' observacao = COALESCE($2, observacao) WHERE id = $1 RETURNING *`, [id, observacao || null]);
        if (rows.length === 0) {
            throw new Error(`Aparelho com id: ${id} não encontrado`);
        }
        return rows[0];
    }
    
    async atualizarUsoHoje(id: number, horas: number): Promise<IAparelho>{
        const { rows } = await pool.query(`UPDATE aparelhos SET uso_hoje = $2 WHERE id=$1 RETURNING *`,[id,horas]);
        if (rows.length === 0) {
            throw new Error(`Aparelho com id: ${id} não encontrado`);
        }
        return rows[0];
    }

    async resetarUsoDiario(): Promise<void>{
        await pool.query('UPDATE aparelhos SET uso_hoje = 0');
    }

    async getEstatisticas(): Promise<{ total: number; ok: number; warning: number; danger: number; precisaManutencao: number; }>{
        const {rows} = await pool.query(`SELECT COUNT(*)::int as total, COUNT(*) FILTER(WHERE status = 'ok')::int as ok, COUNT(*) FILTER(WHERE status = 'precisa_manutencao')::int as precisa_manutencao, COUNT(*) FILTER(WHERE status = 'estragado')::int as estragado, COUNT(*) FILTER(WHERE precisa_manutencao = true)::int as precisam_manutencao FROM aparelhos`)
        return rows[0];
    }
}