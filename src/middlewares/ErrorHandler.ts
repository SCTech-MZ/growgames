import { NextFunction,Request,Response } from "express";


export function ErrorHandler(erro: any, req: Request, res: Response, next: NextFunction) {

    console.error(erro);
    
    if (erro.code === '23505') {
        return res.status(409).json({ erro: 'Registo duplicado', detalhe: erro.detail });
    }
    if (erro.code === '23503') {
        return res.status(409).json({ erro: "Violacao de chave estrangeira", detalhe: erro.detail });
    }

    if (erro.code === '42P01') {
        return res.status(500).json({ erro: 'Tabela nao encontrada', detalhe: erro.message });
    }

    if (erro.code === '400') {
        return res.status(400).json({erro:'Erro ao mandar o resultado', detalhe:erro.message})
    }

    res.status(500).json({ erro: 'Erro interno do servidor...', detalhe: process.env.NODE_ENV === 'development' ? erro.message : undefined });

}
