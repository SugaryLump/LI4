import {PromisedDatabase} from 'promised-sqlite3';

export class Estabelecimento {
  constructor(
    private readonly id: number,
    private nome: string,
    private lotacao: number,
    private rating: number,
    private gamaPreco: GamaPreco,
    private categoria: Categoria,
    private morada: string,
    private coordenadas: {latitude: string; longitude: string},
    private horarioAbertura: Date,
    private horarioFecho: Date,
    private contacto: string,
  ) {}

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
    // ir buscar o local
    // verificar o any
    let estabelecimento: Estabelecimento | null = null as any;
    if (estabelecimento == null) throw 'Local Não Encontrado';
    // FIXME
    let numberRatings = 0;
    return estabelecimento.updateRating(valor, numberRatings);
  }

  async getByGamaPreco(gamaPreco: string): Promise<Estabelecimento[]> {
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
    categoria: Categoria,
    morada: string,
    coordenadas: {latitude: string; longitude: string},
    horarioAbertura: Date,
    horarioFecho: Date,
    contacto: string,
  ): Promise<Estabelecimento> {

    const horario_abertura_parsed = `${horarioAbertura.getHours()}:${horarioAbertura.getMinutes()}`
    const horario_fecho_parsed = `${horarioFecho.getHours()}:${horarioFecho.getMinutes()}`

        console.log("--------------O que vai para db------------")
      console.log(nome)
      console.log(lotacao)
      console.log(rating)
      console.log(GamaPreco[gamaPreco])
      console.log(Categoria[categoria])
      console.log(morada)
      console.log(coordenadas.latitude + ';' + coordenadas.longitude)
      console.log(horario_abertura_parsed)
      console.log(horario_fecho_parsed)
      console.log(contacto)


    const res = await this.db.run(
      "INSERT INTO estabelecimentos(nome,lotacao,pontuacao,morada,coordenadas,precos,categoria,horario_abertura,horario_fecho,contacto) VALUES (?, ?, ?, ?, ?, ?, ?, strftime('%H:%M',?), \
      strftime('%H:%M',?), ?)",
      nome,
      lotacao,
      rating,
      morada,
      coordenadas.latitude + ';' + coordenadas.longitude,
      gamaPreco,
      Categoria[categoria],
      horario_abertura_parsed,
      horario_fecho_parsed,
      contacto,
    );
    return new Estabelecimento(
      res.lastID,
      nome,
      lotacao,
      rating,
      gamaPreco,
      categoria,
      morada,
      coordenadas,
      horarioAbertura,
      horarioFecho,
      contacto,
    );
  }
}
