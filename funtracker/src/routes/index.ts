import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { UserDAO } from '../model/User'

const apiRouter = Router()

apiRouter.post('/users',
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

apiRouter.get('/users/:username', async (req, res) => {
  // ... e aqui a de ir buscar informação sobre um!
})

const baseRouter = Router()
baseRouter.use('/api/v1', apiRouter)

export default baseRouter
