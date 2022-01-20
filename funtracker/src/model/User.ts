/// TODO!

import * as bcrypt from 'bcrypt'
import { PromisedDatabase } from 'promised-sqlite3'

import {UserAlreadyExistsException, InvalidCredentialsExceptions, UserNotFoundException} from '../exceptions/index'
import {Result, fail} from './Result'

export type User = {
    id: number
    username: string
    passwordHash: string
}

export class UserDAO {
    private readonly db: PromisedDatabase

    constructor(db: PromisedDatabase) {
        this.db = db
    }

    // FIXME falta verificar se o user nao foi criado
    async createUser(username: string, password: string): Promise<Result<User,UserAlreadyExistsException>> {
        let passwordHash = await bcrypt.hash(password, 10)
        let r = await this.db.run("INSERT INTO utilizadores (username, password_hash) VALUES (?, ?)", username, passwordHash)
        return fail( ({success})=> {

           return success ({
            id: r.lastID,
            username,
            passwordHash
           })
        })
    }

    // TODO
    async login(username: string, password: string): Promise<Result<User, InvalidCredentialsExceptions>> {
        return fail( ({success, fail}) => {
            return fail( new InvalidCredentialsExceptions(username) )
        } )
    }
}
