import { PromisedDatabase } from 'promised-sqlite3'

export type Classificacao = {
    id: number
    valor: number
    comentario: string | null
    estabelecimentoNoturnoId: number
    utilizadorId: number
}

export class ClassificacaoDao {
    private readonly db: PromisedDatabase

    constructor(db: PromisedDatabase) {
        this.db = db
    }

    async createClassificacao(valor: number, comentario: string | null, estabelecimentoNoturnoId: number, utilizadorId: number): Promise<Classificacao> {

        let id = await this.db.run("INSERT INTO avaliacoes (valor, comentarios, estabelecimento_id, user_id) VALUES (?, ?, ?, ?)", valor, comentario, estabelecimentoNoturnoId, utilizadorId)
        return {
            id: id.lastID,
            valor,
            comentario,
            estabelecimentoNoturnoId,
            utilizadorId
        }
    }
}
