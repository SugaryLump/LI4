import {PromisedDatabase} from 'promised-sqlite3';

export type Classificacao = {
  id: number;
  valor: number;
  comentario: string | null;
  estabelecimentoNoturnoId: number;
  utilizadorId: number;
};

export class ClassificacaoDAO {
  private readonly db: PromisedDatabase;

  constructor(db: PromisedDatabase) {
    this.db = db;
  }

  async createClassificacao(
    valor: number,
    comentario: string | null,
    estabelecimentoNoturnoId: number,
    utilizadorId: number,
  ): Promise<Classificacao> {
    if ( await this.db.exists("avaliacoes", "estabelecimento_id = ? AND user_id = ?", estabelecimentoNoturnoId,utilizadorId) ) {
            throw "Avaliação já existe"
    }
    let id = await this.db.run(
      'INSERT INTO avaliacoes (valor, comentarios, estabelecimento_id, user_id) VALUES (?, ?, ?, ?)',
      valor,
      comentario,
      estabelecimentoNoturnoId,
      utilizadorId,
    );
    return {
      id: id.lastID,
      valor,
      comentario,
      estabelecimentoNoturnoId,
      utilizadorId,
    };
  }

  async getClassificacoesByUserID(userID: number): Promise<Classificacao[]> {
    return (
      await this.db.all('SELECT * FROM avaliacoes WHERE user_id = ?', userID)
    ).map(c => ({
      id: c.id,
      valor: c.valor,
      comentario: c.comentario,
      estabelecimentoNoturnoId: c.estabelecimento_id,
      utilizadorId: c.user_id,
    }));
  }

  async getClassificacoesByEstabelecimentoId(estabelecimentoID: number): Promise<Classificacao[]> {
    return (
      await this.db.all('SELECT * FROM avaliacoes WHERE estabelecimento_id = ?', estabelecimentoID)
    ).map(c => ({
      id: c.id,
      valor: c.valor,
      comentario: c.comentario,
      estabelecimentoNoturnoId: c.estabelecimento_id,
      utilizadorId: c.user_id,
    }));
  }
}
