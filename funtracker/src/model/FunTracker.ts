import {UserDAO, User}  from './User'
import {Classificacao, ClassificacaoDao}  from './Classificacao'
import {LocalNoturno, LocalNoturnoDao}  from './LocalNoturno'

import {Result, fail} from './Result'
import {PromisedDatabase } from 'promised-sqlite3'
import { LocalNoturnoNotFound } from 'src/exceptions'

export class FunTracker {
    constructor(
        private readonly db: PromisedDatabase,
        private users: UserDAO,
        private classificacaoDao: ClassificacaoDao,
        private localNoturnoDao: LocalNoturnoDao
    ) {}

    async iniciarSessao(username: string, password: string): Promise<Result<User, Error>> {
        return this.users.login(username,password)
    }

    async criarConta(username: string, password: string): Promise<Result<User,Error>> {
        return this.users.createUser(username, password)
    }

    async avaliar(valor: number, comentario: string | null, estabelecimentoNoturnoId: number, utilizadorId: number):
    Promise<Result<Classificacao,Error>> {
        // Verificar se existe estabelecimento e ir busca lo
        const avaliar = this.localNoturnoDao.avaliar(valor, estabelecimentoNoturnoId)
        const r = !(await avaliar).ok
        return fail(({fail, success})=> {
            if (r)
              return fail(new LocalNoturnoNotFound(estabelecimentoNoturnoId))
            // ver melhor o any
            const newRating = this.classificacaoDao.createClassificacao(valor,comentario, estabelecimentoNoturnoId, utilizadorId) as any;
            return  success(newRating)
        })
        // atualizar o rating do local Noturno
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
