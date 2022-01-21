import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

/// Middleware que verifica se um utilizador está autenticado
export default function (req: any, res: Response, next: NextFunction) {
        try {
            let res: any = jwt.verify(req.body.jwt, req.app.get('secret'));
            req.user = res
            next()
        } catch (e) {
            return res.status(400).json({ success: false, errors: [e] })
        }
}

export type UserJwt = {
    username: string
    id: number
    is_admin: boolean
}

export function getUser(req: any): UserJwt {
    return req.user
}
