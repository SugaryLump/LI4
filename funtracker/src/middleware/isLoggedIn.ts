import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

/// Middleware que verifica se um utilizador está autenticado
export default function (req: any, res: Response, next: NextFunction) {
    try {
        let auth: string = req.headers.authorization
        if (auth.startsWith("Bearer ")) {
            auth = auth.substring(7)
        }
        let res: any = jwt.verify(auth, req.app.get('secret'));
        req.user = res
        next()
    } catch (e) {
        return res.status(403).json({ success: false, errors: ["Permission Denied"] })
    }
}

export type UserJwt = {
    username: string
    id: number
    is_admin: boolean
    special?: boolean
}

export function getUser(req: any): UserJwt {
    return req.user
}
