// Routes relacionadas com utilizadores

import { Router } from "express";
import { body, validationResult } from "express-validator";
import { UserDAO } from "../model/User";
import { FunTracker } from '../model/FunTracker'

const usersRouter = Router()

usersRouter.post('/',
  body('password').exists().isLength({ min: 8 }).withMessage('Must be at least 8 characters long'),
  body('username').exists(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    next()
  },
  async (req, res) => {
    // Seria aqui que teriamos a lógica de criar um utilizador
    let userDAO: UserDAO = new UserDAO(req.app.get('db'))

    try {
      let user = await userDAO.createUser(req.body.username, req.body.password)
      return res.status(200).json({ success: true, user: { username: user.username, id: user.id } })
    } catch (error: any) {
      if (error.errno == 19) {
        // Erro 19 é o erro de uma constraint falhada
        error = "This user already exists"
      }
      return res.status(400).json({
        success: false,
        errors: [error]
      })
    }
  })

usersRouter.post('/:id/changePassword',
  body('password').exists().isLength({ min: 8 }).withMessage('Must be at least 8 characters long'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    next()
  },
  async (req, res) => {
    let funTracker: FunTracker = new FunTracker(req.app.get('db'))

    try {
      funTracker.changePassword(req.body.id,req.body.password)
      return res.status(200).json({ success: true})
    } catch (error: any) {
      if (error.errno == 19) {
        // Erro 19 é o erro de uma constraint falhada
        error = "Password not changed"
      }
      return res.status(400).json({
        success: false,
        errors: [error]
      })
    }
  })

usersRouter.post('/:id/changeUsername',
  body('username').exists(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    next()
  },
  async (req, res) => {
    let funTracker: FunTracker = new FunTracker(req.app.get('db'))

    try {
      funTracker.changeUsername(req.body.id,req.body.username)
      return res.status(200).json({ success: true})
    } catch (error: any) {
      if (error.errno == 19) {
        // Erro 19 é o erro de uma constraint falhada
        error = "Username already exists"
      }
      return res.status(400).json({
        success: false,
        errors: [error]
      })
    }
  })

usersRouter.get('/:id/isAdmin', async (req, res) => {
    let funTracker: FunTracker = new FunTracker(req.app.get('db'))
    return res
        .status(200)
        .json({success: true, isAdmin: funTracker.checkIfIsAdmin(req.body.id)})
})

usersRouter.get('/:id/historico', async (req, res) => {
    return res
        .status(200)
        .json(FunTracker.getClassificacoesByID(req.body.id))
})


export default usersRouter
