import {UserDAO, User}  from './User'
import {Classificacao, ClassificacaoDao}  from './Classificacao'
import {LocalNoturnoDao}  from '../../common/model/LocalNoturno'

import {PromisedDatabase } from 'promised-sqlite3'

export class FunTracker {
    constructor(
        private readonly db: PromisedDatabase,
        private users: UserDAO,
        private classificacaoDao: ClassificacaoDao,
        private localNoturnoDao: LocalNoturnoDao
    ) {}

    /* USERS */
    async iniciarSessao(username: string, password: string): Promise<User> {
        return this.users.login(username,password)
    }

    async criarContaUtilizador(username: string, password: string): Promise<User> {
        return this.users.createUser(username, password)
    }

    async criarContaAdmin(username: string, password: string): Promise<User> {
        return this.users.createAdmin(username, password)
    }

    async changePassword(userId: number, newPassword: string): Promise<void> {
        return this.users.changePassword(userId, newPassword);
    }

    async changeUsername(userId: number, newUsername: string): Promise<void> {
        return this.users.changeUsername(userId, newUsername);
    }

    async checkIfIsAdmin(userId: number): Promise<boolean> {
        return this.users.isAdmin(userId)
    }

    async avaliar(valor: number, comentario: string | null, estabelecimentoNoturnoId: number, utilizadorId: number):
    Promise<Classificacao> {
        // atualizar o rating do local Noturno
        this.localNoturnoDao.avaliar(valor, estabelecimentoNoturnoId)
        return this.classificacaoDao.createClassificacao(valor,comentario, estabelecimentoNoturnoId, utilizadorId);
    }

    // TODO faz sequer sentido??
    async atualizarLocalizacao(userId: number): Promise<boolean> {
        return true
    }
}
