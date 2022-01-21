import {UserDAO, User}  from './User'
import {Classificacao, ClassificacaoDao}  from './Classificacao'
import {LocalNoturnoDao}  from './LocalNoturno'

import {PromisedDatabase } from 'promised-sqlite3'

export class FunTracker {
    constructor(
        private readonly db: PromisedDatabase,
        private users: UserDAO,
        private classificacaoDao: ClassificacaoDao,
        private localNoturnoDao: LocalNoturnoDao
    ) {}

    async iniciarSessao(username: string, password: string): Promise<User> {
        return this.users.login(username,password)
    }

    async criarConta(username: string, password: string): Promise<User> {
        return this.users.createUser(username, password)
    }

    async avaliar(valor: number, comentario: string | null, estabelecimentoNoturnoId: number, utilizadorId: number):
    Promise<Classificacao> {
        // atualizar o rating do local Noturno
        this.localNoturnoDao.avaliar(valor, estabelecimentoNoturnoId)
        return this.classificacaoDao.createClassificacao(valor,comentario, estabelecimentoNoturnoId, utilizadorId);
    }

    // TODO, Ver os argumentos
    async alterarDadosDaConta(userId: number): Promise<boolean> {
        return true
    }

    // TODO faz sequer sentido??
    async atualizarLocalizacao(userId: number): Promise<boolean> {
        return true
    }
}
