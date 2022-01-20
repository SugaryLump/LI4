// TODO

import { Router } from "express";
import { body, validationResult } from "express-validator";
import { UserDAO } from "../model/User";
import jwt from 'jsonwebtoken'

const sessionRouter = Router()

sessionRouter.post('/',
    body('username').exists(),
    body('password').exists(),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() })
        }

        next()
    },
    async (req, res) => {
        let userDao = new UserDAO(req.app.get('db'))
        try {
            let user = await userDao.login(req.body.username, req.body.password)

            res.json({
                success: true,
                jwt: jwt.sign({
                    user_id: user.id,
                    username: user.username,
                    is_admin: false // TODO
                }, req.app.get('secret'))
            })
        } catch (e) {
            res.json({
                success: false,
                errors: [e]
            })
        }
    })

export default sessionRouter