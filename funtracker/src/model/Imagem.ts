import { PromisedDatabase } from "promised-sqlite3"

export class Imagem {
    constructor(
        readonly id: number,
        readonly estabelecimentoId: number,
        readonly filepath: string,
    ){}
}

export class ImagensDAO {
    constructor(
        private readonly db: PromisedDatabase
    ) {}

    // TODO Temos q verificar se o id de estabelecimento tem q ser validado antes ??
    async addImagem(estabelecimentoId: number, filepath: string): Promise<Imagem> {
        if ( await this.db.exists("imagens", "filepath = ?", filepath) ) {
            throw "Imagem já existe"
        }
        let r = await this.db.run("INSERT INTO imagens (estabelecimento_id, filepath) VALUES (?, ?)", estabelecimentoId, filepath)
        return {
            id: r.lastID,
            estabelecimentoId,
            filepath
        }
    }

    async getAllByEstabelecimentoID(estabelecimetoId: number): Promise<Imagem[]> {
        return (
            await this.db.all('SELECT * FROM imagens WHERE user_id = ?', estabelecimetoId)
        ).map(c => ({
            id: c.id,
            estabelecimentoId: c.estabelecimento_id,
            filepath: c.filepath,
        }));
    }
}
