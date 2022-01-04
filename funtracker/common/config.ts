// Este ficheiro define configurações a serem partilhadas entre as duas partes
// da aplicação
import dotenv from 'dotenv'
import commandLineArgs from 'command-line-args'
import path from 'path'
import { address } from 'ip'

interface ConfigOptions {
  serverUrl: string
  mode: string
}

export default function configure (): ConfigOptions {
  const options = commandLineArgs([
    {
      name: 'env',
      alias: 'e',
      defaultValue: 'development',
      type: String
    }
  ])

  const result = dotenv.config({
    path: path.join(__dirname, `../env/${options.env as string}.env`)
  })

  if (result.error != null) {
    throw result.error
  }

  return {
    serverUrl: process.env.SERVER_URL ?? address(),
    mode: process.env.NODE_ENV ?? 'development'
  }
}
