import { Router } from 'express'
import sessionRouter from './session'
import localNoturnoRouter from './localNoturno'
import usersRouter from './users'

const apiRouter = Router()

apiRouter.use('/user', usersRouter)
apiRouter.use('/local', localNoturnoRouter)
apiRouter.use('/session', sessionRouter)

const baseRouter = Router()
baseRouter.use('/api/v1', apiRouter)

export default baseRouter
