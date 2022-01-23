import * as bcrypt from 'bcrypt'
import { PromisedDatabase } from 'promised-sqlite3'

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

    async createUser(username: string, password: string): Promise<User> {
        if ( await this.db.exists("utilizadores", "username = ?", username) ) {
            throw "Utilizador já existe"
        }

        let passwordHash = await bcrypt.hash(password, 10)
        let r = await this.db.run("INSERT INTO utilizadores (username, password_hash, is_admin) VALUES (?, ?, ?)", username, passwordHash, false)
        return {
            id: r.lastID,
            username,
            passwordHash,
            isAdmin: false
        }
    }

    async createAdmin(username: string, password: string): Promise<User> {
        if ( await this.db.exists("utilizadores", "username = ?", username) ) {
            throw "Utilizador já existe"
        }

        let passwordHash = await bcrypt.hash(password, 10)
        let r = await this.db.run("INSERT INTO utilizadores (username, password_hash,is_admin) VALUES (?, ?,?)", username, passwordHash,true)
        return {
            id: r.lastID,
            username,
            passwordHash,
            isAdmin: true
        }
    }

    async login(username: string, password: string): Promise<User> {
        let {id, password_hash, is_admin} = await this.db.get("SELECT id, password_hash, is_admin FROM utilizadores WHERE `username` = ?", username)
        if (await bcrypt.compare(password, password_hash)) {
            return {
                username,
                id,
                passwordHash: password_hash,
                isAdmin: is_admin
            }
        } else {
            throw "Credenciais inválidos"
        }
    }

    async changePassword(userId: number, newPassword: string): Promise<void> {
        if ( !await this.db.exists("utilizadores", "id = ?", userId) ) {
            throw "Utilizador não existe"
        }
        let passwordHash = await bcrypt.hash(newPassword, 10)
        this.db.run("UPDATE utilizadores SET `password_hash` = ? WHERE `id` = ?", passwordHash, userId)
    }

    async changeUsername(userId: number, newUsername: string): Promise<void> {
        if ( !await this.db.exists("utilizadores", "id = ?", userId) ) {
            throw "Utilizador não existe"
        }
        if ( await this.db.exists("utilizadores", "username = ?", newUsername) ) {
            throw "Utilizador com esse username já existe"
        }
        this.db.run("UPDATE utilizadores SET `username` = ? WHERE `id` = ?", newUsername, userId)
    }

    async isAdmin(userId: number): Promise<boolean> {
        if ( !await this.db.exists("utilizadores", "id = ?", userId) ) {
            throw "Utilizador não existe"
        }
        let {isAdmin} = await this.db.get("SELECT is_admin FROM utilizadores WHERE `id` = ?", userId)
        return isAdmin;
    }

    async allUsers(): Promise<User[]> {
        return (
            await this.db.all('SELECT * FROM utilizadores')
        ).map(c => ({
            id: c.id,
            username: c.username,
            passwordHash: c.password_hash,
            isAdmin: c.is_admin
        }));
    }


    async getById(userId: number): Promise<User> {
        let {username, isAdmin, passwordHash} = await this.db.get("SELECT username, is_admin, password_hash FROM utilizadores WHERE `id` = ?", userId)
        return{
            id: userId,
            username,
            passwordHash,
            isAdmin
        }
    }

    async removeByID(id: number): Promise<boolean> {
        return (await this.db.run('DELETE from utilizadores where id = ?', id)).changes == 1;
    }
}
