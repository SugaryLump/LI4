/**
 * Configura todas as opções do servidor Express, como middleware e routers.
 * @module
 */
import express, { Application } from 'express'
import morgan from 'morgan'
import baseRouter from './routes'
import {FunTracker} from './model/FunTracker'
import cors from 'cors'
import { PromisedDatabase } from 'promised-sqlite3'
import migrate from './model/migrations'

export default async function (): Promise<Application> {
  const app = express()

  const db = new PromisedDatabase()
  await db.open('./db.sqlite3')
  const ft = new FunTracker(db)

  await migrate(db)

  app.set('db', db)
  app.set('secret', 'TODO gerar segredo random mas isto serve por agora')
  app.use(express.static('images'))

  // Permite suportar requests com JSON
  app.use(express.json({ limit: '50mb' }))

  // Permite que os requests venham de outras origens
  app.use(cors())

  if (process.env.NODE_ENV === 'development') {
    // Logger
    app.use(morgan('dev'))
  }

  // Vamos 'montar' o router principal
  app.use('/', baseRouter)

  return app
}
