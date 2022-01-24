import {PromisedDatabase} from 'promised-sqlite3';

export type Classificacao = {
  id: number;
  valor: number;
  comentario: string | null;
  estabelecimentoNoturnoId: number;
  estabelecimentoNoturnoNome?: string;
  estabelecimentoNoturnoImagem?: string;
  utilizadorId: number;
  username: string;
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

    let {username} = await this.db.get('SELECT username FROM utilizadores WHERE id = ?', utilizadorId)

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
      username,
    };
  }

  async getClassificacoesByUserID(userID: number): Promise<Classificacao[]> {
    let c = (
      await this.db.all(`
        SELECT avaliacoes.*, u.username AS username, e.nome AS estabelecimento_nome, group_concat(filepath) AS images FROM avaliacoes
        LEFT JOIN utilizadores u on avaliacoes.user_id = u.id
        LEFT JOIN estabelecimentos e on avaliacoes.estabelecimento_id = e.id
        LEFT JOIN imagens i on e.id = i.estabelecimento_id
        WHERE user_id = ?
      `, userID)
    ).map(c => {
      return {
        id: c.id,
        valor: c.valor,
        comentario: c.comentarios,
        estabelecimentoNoturnoId: c.estabelecimento_id,
        utilizadorId: c.user_id,
        username: c.username,
        estabelecimentoNoturnoImagem: (c.images as string).split(",").reverse()[0],
        estabelecimentoNoturnoNome: c.estabelecimento_nome
      }
    });
    return c
  }

  async getClassificacoesByEstabelecimentoId(estabelecimentoID: number): Promise<Classificacao[]> {
    let c = (
      await this.db.all(`
        SELECT avaliacoes.*, username FROM avaliacoes
        LEFT JOIN utilizadores u on u.id = avaliacoes.user_id
        WHERE estabelecimento_id = ?
      `, estabelecimentoID)
    ).map(c => {
      return {
        id: c.id,
        valor: c.valor,
        comentario: c.comentarios,
        estabelecimentoNoturnoId: c.estabelecimento_id,
        utilizadorId: c.user_id,
        username: c.username,
      }
    });
    return c
    // return (
    //   await this.db.all('SELECT avaliacoes.*, username FROM avaliacoes LEFT JOIN utilizadores WHERE estabelecimento_id = ?', estabelecimentoID)
    // ).map(c => ({
    //   id: c.id,
    //   valor: c.valor,
    //   comentario: c.comentario,
    //   estabelecimentoNoturnoId: c.estabelecimento_id,
    //   utilizadorId: c.user_id,
    //   username: c.username
    // }));
  }
}
