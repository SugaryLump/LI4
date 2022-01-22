import { NextFunction, Request, Response } from "express";
import { getUser } from ".";

export function hasPermission(req: any, res: Response, next: NextFunction) {
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

export function isSpecial(req: Request, res: Response, next: NextFunction) {
  let user = getUser(req)
  if (user.special === true || user.is_admin) {
    next()
  } else {
    return res.status(403).json({
      success: false,
      errors: ['Permission denied']
    })
  }
}