import { User } from '.prisma/client'
import { ValidationError } from 'express-validator'

export interface API {
  '/users': {
    POST: {
      body: {
        username: string
        password: string
      }
      response: {
        success: boolean
        id?: number
        errors?: Array<ValidationError | string>
      }
    }
  }
  '/users/:username': {
    GET: {
      params: {
        username: string
      }
      response: {
        success: boolean
        user?: User
      }
    }
  }
}
