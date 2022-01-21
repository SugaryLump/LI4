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
  async getClassificacoesByID(userID: string): Promise<Classificacao[]> {
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
}
