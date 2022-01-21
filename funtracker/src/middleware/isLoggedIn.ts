import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

/// Middleware que verifica se um utilizador está autenticado
export default function (req: any, res: Response, next: NextFunction) {
    if (req.body.jwt != null) {
        try {
            let res: any = jwt.verify(req.body.jwt, req.app.get('secret'));
            req.user = res
            next()
        } catch (e) {
            return res.status(400).json({ success: false, errors: [e] })
        }
    }
}