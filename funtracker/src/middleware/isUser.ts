import { NextFunction, Request, Response } from "express";

export function isUser(req: any, res: Response, next: NextFunction) {
   if (+req.params.id === req.user.id || req.user.is_admin) {
     next()
   } else {
     return res.status(403).json({
       success: false,
       errors: ['Permission Denied']
     })
   }
}


export function isAdmin(req: any, res: Response, next: NextFunction) {
   if (req.user.is_admin) {
     next()
   } else {
     return res.status(403).json({
       success: false,
       errors: ['Permission Denied']
     })
   }
}
