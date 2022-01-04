/// TODO!

import * as bcrypt from 'bcrypt'
import { PromisedDatabase } from 'promised-sqlite3'

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

    async createUser(username: string, password: string): Promise<User> {
        let passwordHash = await bcrypt.hash(password, 10)
        let r = await this.db.run("INSERT INTO utilizadores (username, password_hash) VALUES (?, ?)", username, passwordHash)
        return {
            id: r.lastID,
            username,
            passwordHash
        }
    }
}