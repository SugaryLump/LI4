import RestypedRouter from 'restyped-express'
import { API } from 'common/api'
import { Router } from 'express'
import { body, validationResult } from 'express-validator'

const apiRouter = Router()
const typedRouter = RestypedRouter<API>(apiRouter)

typedRouter.post('/users',
  async (req, res) => {
    // Seria aqui que teriamos a lógica de criar um utilizador
  },
  body('password', 'Password is required').exists(),
  body('username', 'Username is required').exists(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    next()
  })

typedRouter.get('/users/:username', async (req, res) => {
  // ... e aqui a de ir buscar informação sobre um!
})

const baseRouter = Router()
baseRouter.use('/api/v1', apiRouter)

export default baseRouter
