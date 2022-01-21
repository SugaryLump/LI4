/// TODO!

import * as bcrypt from 'bcrypt'
import { PromisedDatabase } from 'promised-sqlite3'

import {UserAlreadyExistsException, InvalidCredentialsExceptions, UserNotFoundException} from '../exceptions/index'

export type User = {
    id: number
    username: string
    passwordHash: string
    isAdmin: boolean
}

export class UserDAO {
    private readonly db: PromisedDatabase

    constructor(db: PromisedDatabase) {
        this.db = db
    }

    // FIXME falta verificar se o user nao foi criado
    async createUser(username: string, password: string): Promise<User> {
        let passwordHash = await bcrypt.hash(password, 10)
        let r = await this.db.run("INSERT INTO utilizadores (username, password_hash) VALUES (?, ?)", username, passwordHash)
        return {
            id: r.lastID,
            username,
            passwordHash,
            isAdmin: false
        }
    }

    // FIXME falta verificar se o user nao foi criado
    async createAdmin(username: string, password: string): Promise<User> {
        let passwordHash = await bcrypt.hash(password, 10)
        let r = await this.db.run("INSERT INTO utilizadores (username, password_hash) VALUES (?, ?)", username, passwordHash)
        return {
            id: r.lastID,
            username,
            passwordHash,
            isAdmin: true
        }
    }

    async login(username: string, password: string): Promise<User> {
        let {id, password_hash, isAdmin} = await this.db.get("SELECT id, password_hash, is_admin FROM utilizadores WHERE `username` = ?", username)
        if (await bcrypt.compare(password, password_hash)) {
            return {
                username,
                id,
                passwordHash: password_hash,
                isAdmin
            }
        } else {
            throw "Credenciais inválidos"
        }
    }

    async changePassword(userId: number, newPassword: string): Promise<void> {
        // verificar se realmente existe
        let {username} = await this.db.get("SELECT username FROM utilizadores WHERE `id` = ?", userId)
        let passwordHash = await bcrypt.hash(newPassword, 10)
        //TODO atualizar a nova password na base de dados (verificar se ta bem)
        this.db.get("UPDATE utilizadores SET `password_hash` = ? WHERE `id` = ?", passwordHash, userId)
    }

    async changeUsername(userId: number, newUsername: string): Promise<void> {
        // verificar se existe
        let {password_hash} = await this.db.get("SELECT password_hash FROM utilizadores WHERE `id` = ?", userId)
        // TODO verificar se o novo userName é unico

        // TODO atualizar o novo userName na base de dados (verificar se ta bem)
        this.db.get("UPDATE utilizadores SET `username` = ? WHERE `id` = ?", newUsername, userId)
    }

    async isAdmin(userId: number): Promise<boolean> {
        let {isAdmin} = await this.db.get("SELECT is_admin FROM utilizadores WHERE `id` = ?", userId)
        return isAdmin;
    }
}
