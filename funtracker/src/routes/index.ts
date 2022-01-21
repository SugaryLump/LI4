import { Router } from 'express'
import sessionRouter from './session'
import estabelecimentoRouter from './estabelecimento'
import usersRouter from './users'

const apiRouter = Router()

apiRouter.use('/user', usersRouter)
apiRouter.use('/estabelecimento', estabelecimentoRouter)
apiRouter.use('/session', sessionRouter)

const baseRouter = Router()
baseRouter.use('/api/v1', apiRouter)

export default baseRouter
