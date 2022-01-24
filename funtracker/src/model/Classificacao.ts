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

export interface IClassificacaoDAO {
  createClassificacao(valor: number, comentario: string | null, estabelecimentoNoturnoId: number, utilizadorId: number): Promise<Classificacao>
  getClassificacoesByUserID(userID: number): Promise<Classificacao[]>
  getClassificacoesByEstabelecimentoId(estabelecimentoID: number): Promise<Classificacao[]>
  removeByEstabelecimentoId(estabelecimentoId: number): Promise<boolean>
}

export class ClassificacaoDAO implements IClassificacaoDAO {
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
    let vazio = false
    let c = (
      await this.db.all(`
        SELECT avaliacoes.*, u.username AS username, e.nome AS estabelecimento_nome, group_concat(filepath) AS images FROM avaliacoes
        LEFT JOIN utilizadores u on avaliacoes.user_id = u.id
        LEFT JOIN estabelecimentos e on avaliacoes.estabelecimento_id = e.id
        LEFT JOIN imagens i on e.id = i.estabelecimento_id
        WHERE user_id = ?
      `, userID)
    ).map(c => {
      if (c.id == null || c.id ===undefined)
        vazio = true

      let imagensString = c.images as string
      let imagens = ""
      if (imagensString) {
          let aux = imagensString.split(",")
        if(aux)
          imagens = aux.reverse()[0]
      }
      return {
        id: c.id,
        valor: c.valor,
        comentario: c.comentarios,
        estabelecimentoNoturnoId: c.estabelecimento_id,
        utilizadorId: c.user_id,
        username: c.username,
        // estabelecimentoNoturnoImagem: (c.images as string).split(",").reverse()[0],
        estabelecimentoNoturnoImagem: imagens,
        estabelecimentoNoturnoNome: c.estabelecimento_nome
      }
    });
    if (vazio)
      return []
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
  }

  async removeByEstabelecimentoId(estabelecimentoId: number): Promise<boolean> {
      return (await this.db.run('DELETE from avaliacoes where estabelecimento_id = ?', estabelecimentoId)).changes == 1
  }
}
