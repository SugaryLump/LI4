import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { UserDAO } from '../model/User'
import sessionRouter from './session'
import usersRouter from './users'

const apiRouter = Router()

apiRouter.use('/user', usersRouter)
apiRouter.use('/session', sessionRouter)

const baseRouter = Router()
baseRouter.use('/api/v1', apiRouter)

export default baseRouter
