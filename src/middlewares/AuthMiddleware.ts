import { Request, Response, NextFunction } from "express";
import  Jwt  from "jsonwebtoken";
import { userPayLoad } from "../interface/user.interface";

interface TokenPayLoad{
    id: number;
    email: string;
    perfil: 'admin' | 'super';
}

const JWT_SECRET = process.env.JWT_SECRET || 'growgamesecret';

export function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: "Token nao enviado.",detalhe: "Envie o token no header" });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            erro: "Formato de token invalido"
        });
    }

    const token = parts[1];

    try {
        const decoded = Jwt.verify(token, process.env.JWT_SECRET || 'growgamesecret') as TokenPayLoad;

        req.userId = decoded.id;
        req.perfil = decoded.perfil;
        console.log(`${req.perfil}`)

        if (!decoded.perfil) {
            console.log("Nao decodificado")
        }

        console.log(`usuario autenticado ID= ${decoded.id},perfil=${decoded.perfil}`)

        next();
    } catch (erro:any) {
        console.error("Erro na verificacao do token:", erro.message);

        if (erro.name === 'JsonWebTokenError') {
            return res.status(401).json({ erro: "Erro na autenticacao, o token fornecido nao e valido" });
        }
        return res.status(500).json({ erro: 'Erro na requisicao, nao foi possivel verificar o token' });
    }
    
}


export function superAdminOnly(req: Request, res: Response, next: NextFunction) {

    if (!req.perfil) {
        return res.status(401).json({erro:"Acesso negado.Apenas super admin pode realizar esta accao"})
    }
    console.log("Acesso autorizado ao super admin");

    if (req.perfil !== 'super') {
        return res.status(403).json({Error:'Apenas super admin pode executar esta accao.'})
    }
    next();
}
