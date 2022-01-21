import {UserDAO, User}  from './User'
import {Classificacao, ClassificacaoDAO}  from './Classificacao'
import {LocalNoturnoDAO, LocalNoturno}  from './LocalNoturno'

import {PromisedDatabase } from 'promised-sqlite3'

export class FunTracker {
        private static db: PromisedDatabase
        private static users: UserDAO
        private static classificacaoDAO: ClassificacaoDAO
        private static localNoturnoDAO: LocalNoturnoDAO
constructor(db: PromisedDatabase) {FunTracker.db = db;
            FunTracker.users = new UserDAO(db);
            FunTracker.classificacaoDAO = new ClassificacaoDAO(db);
            FunTracker.localNoturnoDAO = new LocalNoturnoDAO(db);
        }

    /* USERS */
    async iniciarSessao(username: string, password: string): Promise<User> {
        return FunTracker.users.login(username,password)
    }

    async criarContaUtilizador(username: string, password: string): Promise<User> {
        return FunTracker.users.createUser(username, password)
    }

    async criarContaAdmin(username: string, password: string): Promise<User> {
        return FunTracker.users.createAdmin(username, password)
    }

    async changePassword(userId: number, newPassword: string): Promise<void> {
        return FunTracker.users.changePassword(userId, newPassword);
    }

    async changeUsername(userId: number, newUsername: string): Promise<void> {
        return FunTracker.users.changeUsername(userId, newUsername);
    }

    async checkIfIsAdmin(userId: number): Promise<boolean> {
        return FunTracker.users.isAdmin(userId)
    }

    /* Estabelecimentos */
    // TODO
    async criarEstabelecimento(): Promise<null> {
        return null
    }

    async allEstabelecimentos(): Promise<null> {
        return null
    }

    async avaliar(valor: number, comentario: string | null, estabelecimentoNoturnoId: number, utilizadorId: number):
    Promise<Classificacao> {
        // atualizar o rating do local Noturno
        FunTracker.localNoturnoDAO.avaliar(valor, estabelecimentoNoturnoId)
        return FunTracker.classificacaoDAO.createClassificacao(valor,comentario, estabelecimentoNoturnoId, utilizadorId);
    }


    // TODO faz sequer sentido??
    async atualizarLocalizacao(userId: number): Promise<boolean> {
        return true
    }

    static async getClassificacoesByID(userID: number) {
            return FunTracker.classificacaoDAO.getClassificacoesByID(userID)
    }
}
