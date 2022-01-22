import {PromisedDatabase} from 'promised-sqlite3';

export class Estabelecimento {
    constructor(
        private readonly id: number,
        private nome: string,
        private lotacao: number,
        private rating: number,
        private gamaPreco: string,
        private categorias: string[],
        private morada: string,
        private coordenadas: {latitude: string; longitude: string},
        private horarioAbertura: Date,
        private horarioFecho: Date,
        private contacto: string
    ) {} // caller must increment numberRatings
  // caller must increment numberRatings
  updateRating(newRating: number, numberRatings: number): number {
    const sum: number = this.rating * numberRatings;
    return (this.rating = (sum + newRating) / (numberRatings + 1));
  }
}

export enum Categoria {
  Bar,
  Discoteca,
}

export enum GamaPreco {
  $,
  $$,
  $$$,
}

export class EstabelecimentoDAO {
  constructor(private readonly db: PromisedDatabase) {}

  async avaliar(valor: number, estabelecimentoId: number): Promise<number> {
    let estabelecimento: Estabelecimento = await this.getByID(estabelecimentoId);
    if (estabelecimento == null) throw 'Local Não Encontrado';
    let numberRatings = await this.countClassificacoes(estabelecimentoId);
    const rating = estabelecimento.updateRating(valor, numberRatings);
    await this.db.run("UPDATE estabelecimento SET `pontuacao` = ? WHERE `id` = ?", estabelecimento)
    return rating;
  }

  private async countClassificacoes(estabelecimentoId: number): Promise<number> {
    return await this.db.get('SELECT COUNT(*) from avaliacoes where estabelecimento_id = ?', estabelecimentoId);
  }

  async getByID(id: number): Promise<Estabelecimento> {
    return await this.db.get('SELECT * from estabelecimentos where id = ?', id);
  }

  async getAll(): Promise<Estabelecimento[]> {
    return await this.db.all('SELECT * from estabelecimentos');
  }

  async cria(
    nome: string,
    lotacao: number,
    rating: number,
    gamaPreco: GamaPreco,
    categorias: Categoria[],
    morada: string,
    coordenadas: {latitude: string; longitude: string},
    horarioAbertura: Date,
    horarioFecho: Date,
    contacto: string,
  ): Promise<Estabelecimento> {

    const buildTime = (date : Date) => {
        let leadingZero = (str : number)  => { return ("0" + str).slice(-2)}
        return  `${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}`
    }

        console.log("--------------O que vai para db------------")
      console.log(nome)
      console.log(lotacao)
      console.log(rating)
      console.log(GamaPreco[gamaPreco])
      categorias.forEach(c => console.log(Categoria[c]))
      console.log(morada)
      console.log(coordenadas.latitude + ';' + coordenadas.longitude)
      console.log(buildTime(horarioAbertura))
      console.log(buildTime(horarioFecho))
      console.log(contacto)


    const res = await this.db.run(
      "INSERT INTO estabelecimentos(nome,lotacao,pontuacao,morada,coordenadas,precos,horario_abertura,horario_fecho,contacto) VALUES (?, ?, ?, ?, ?, ?,  strftime('%H:%M',?), strftime('%H:%M',?), ?)",
      nome,
      lotacao,
      rating,
      morada,
      coordenadas.latitude + ';' + coordenadas.longitude,
      gamaPreco,
      buildTime(horarioAbertura),
      buildTime(horarioFecho),
      contacto
    );

      var fun = (last_id: number ,category_name: string) =>  {
          return this.db.run("INSERT INTO categorias(estabelecimento_id,categoria) VALUES (?,?)", last_id, category_name )
      }
      const categorias_names: string[] = categorias.map(c => Categoria[c])
      categorias_names.forEach(c => fun(res.lastID,c))

    return new Estabelecimento(
      res.lastID,
      nome,
      lotacao,
      rating,
      GamaPreco[gamaPreco],
      categorias_names,
      morada,
      coordenadas,
      horarioAbertura,
      horarioFecho,
      contacto,
    );
  }

  private async getByGamaPreco(gamaPreco: string): Promise<Estabelecimento[]> {
    //return (
    //    await this.db.all('SELECT * FROM estabelecimentos WHERE gamaPreco = ?', gamaPreco)
    //).map(c => ({
    //    id: c.id,
    //    lotacao: c.lotacao,
    //    morada: c.morada,
    //    rating: c.rating, // nao tem isto na base de dados
    //    gamaPreco: c.gamaPreco, // nao tem isto na base de dados
    //    precos: c.precos,
    //    categoria: c.categoria,
    //    pontuacao: c.pontuacao,
    //    coordenadas: {c.coordenadas.latitude, c.coordenadas.longitude}, // coordenadas
    //    horario_abertura: c.horario_abertura,
    //    horario_fecho: c.horario_fecho,
    //    contacto: c.contacto
    //}));
    return [];
  }

  //TODO
  private async getByLocalizacao(localizacao: {latitude: string; longitude: string}
                        ): Promise<Estabelecimento[]> {
    return [];
  }

  //TODO
  private async getByCategorias(categorias: Categoria[]): Promise<Estabelecimento[]> {
    return [];
  }

  //TODOk
  async getByFiltros(localizacao: {latitude: string; longitude: string}| null ,
                     gamaPreco: string | null, categorias: Categoria[] | null):
  Promise<Estabelecimento[]> {
    return [];
  }
}
