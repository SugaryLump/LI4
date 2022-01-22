import {PromisedDatabase} from 'promised-sqlite3';

export class Estabelecimento {
    constructor(
        public id: number,
        public nome: string,
        public lotacao: number,
        public rating: number,
        public gamaPreco: string,
        public morada: string,
        public coordenadas: {latitude: string, longitude: string},
        public contacto: string
    ) {} // caller must increment numberRatings
    public categorias: string[] = []
    public horarioAbertura: Date = new Date()
    public horarioFecho: Date =  new Date()
  // caller must increment numberRatings
  updateRating(newRating: number, numberRatings: number): number {
    const sum: number = this.rating * numberRatings;
    return (this.rating = (sum + newRating) / (numberRatings + 1));
  }

  setCategorias(categorias: string[]) {
      this.categorias = categorias
  }

  setHorarios(horario_abertura: string, horario_fecho: string) {
      const splited_abertura = horario_abertura.split(";");
      const splited_fecho = horario_fecho.split(";");
      this.horarioAbertura.setHours(+splited_abertura[0])
      this.horarioAbertura.setMinutes(+splited_abertura[1])
      this.horarioFecho.setHours(+splited_fecho[0])
      this.horarioFecho.setMinutes(+splited_fecho[1])
  }
    setHorarioAbertura(horarioAbertura: Date) {
        this.horarioAbertura = horarioAbertura;
    }
    setHorarioFecho(horarioFecho: Date) {
        this.horarioFecho = horarioFecho;
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
    return await this.db.get('SELECT * from estabelecimentos where id = ?', id) ;
  }

  async getAll(): Promise<Estabelecimento[]> {
      let estabelecimentos : Estabelecimento [] = []

      let c = await this.db.each('SELECT * from estabelecimentos', [], (row: any) => {
        const coords : string = row.coordenadas.split(";")
        const est : Estabelecimento = new Estabelecimento(row.id, row.nome,row.lotacao,row.pontuacao,row.precos,row.morada,{latitude:coords[0], longitude: coords[1]}, row.contacto)
        estabelecimentos.push(est)
    });

      await Promise.all(estabelecimentos.map(async c => {
        const categorias : string[] = await this.db.all('SELECT categoria FROM categorias WHERE estabelecimento_id = ?',c.id)
        c.setCategorias(categorias)
      }))
      return estabelecimentos
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

     let est = new Estabelecimento(
      res.lastID,
      nome,
      lotacao,
      rating,
      GamaPreco[gamaPreco],
      morada,
      coordenadas,
      contacto
    );
      est.setCategorias(categorias_names)
      est.setHorarioAbertura(horarioAbertura)
      est.setHorarioFecho(horarioFecho)
      return est
  }

  public async adicionarCategoria(categoria: Categoria, estabelecimento_id: number): Promise<{categoria: Categoria, estabelecimento_id: number}> {
    if ( await this.db.exists("categorias", "categoria = ? AND estabelecimento_id = ?", categoria, estabelecimento_id) ) {
        throw "Categoria já existe"
    }
    await this.db.run("INSERT INTO categorias (estabelecimento_id, categoria) VALUES (?,?)", estabelecimento_id, categoria)
    return {
      categoria: categoria,
      estabelecimento_id: estabelecimento_id
    }
  }


  //TODO verificar
//  async getByGamaPreco(gamaPreco: GamaPreco): Promise<Estabelecimento[]> {
//    return (
//      await this.db.all('SELECT * FROM estabelecimentos where precos=?', gamaPreco)
//    )
//      .map(c => (
//        new Estabelecimento(
//         c.id,
//         c.nome,
//         c.lotacao,
//         c.pontuacao,
//         c.precos,
//      // TODO mudar
//         [],
//         c.morada,
//         {latitude: c.coordenadas.latitude, longitude: c.coordenadas.longitude}, // coordenadas
//         c.horario_abertura,
//         c.horario_fecho,
//         c.contacto)
//    ))
//  }
//
//  //TODO verificar
//  async getSortByPrecos(): Promise<Estabelecimento[]> {
//    return (
//      await this.db.all('SELECT * FROM estabelecimentos ORDER BY precos ASC')
//    )
//      .map(c => (
//        new Estabelecimento(
//         c.id,
//         c.nome,
//         c.lotacao,
//         c.pontuacao,
//         c.precos,
//      // TODO mudar
//         [],
//         c.morada,
//         {latitude: c.coordenadas.latitude, longitude: c.coordenadas.longitude}, // coordenadas
//         c.horario_abertura,
//         c.horario_fecho,
//         c.contacto)
//    ))
//  }

  //TODO ordenado do mais perto para o mais longe
  public async getBySortLocalizacao(localizacao: {latitude: string; longitude: string}
                        ): Promise<Estabelecimento[]> {
    return [];
  }

  // TODO verificar
//  async getSortByPontuacao(): Promise<Estabelecimento[]> {
//    return (
//      await this.db.all('SELECT * FROM estabelecimentos ORDER BY pontuacao DESC')
//    )
//      .map(c => (
//        new Estabelecimento(
//         c.id,
//         c.nome,
//         c.lotacao,
//         c.pontuacao,
//         c.precos,
//      // TODO mudar
//         [],
//         c.morada,
//         {latitude: c.coordenadas.latitude, longitude: c.coordenadas.longitude}, // coordenadas
//         c.horario_abertura,
//         c.horario_fecho,
//         c.contacto)
//    ))
//  }

  // TODO verificar
//  async getSortByCategorias(): Promise<Estabelecimento[]> {
//    return (
//      await this.db.all('SELECT estabelecimentos.* , categorias.categoria FROM estabelecimentos LEFT JOIN categorias ON categorias.estabelecimento_id = categorias.estabelecimento_id')
//    )
//      .map(c => (
//        new Estabelecimento(
//         c.id,
//         c.nome,
//         c.lotacao,
//         c.pontuacao,
//         c.precos,
//      // TODO mudar
//         [],
//         c.morada,
//         {latitude: c.coordenadas.latitude, longitude: c.coordenadas.longitude}, // coordenadas
//         c.horario_abertura,
//         c.horario_fecho,
//         c.contacto)
//    ))
//  }

  //TODO verificar
  //private async getByCategorias(categorias: Categoria[]): Promise<Estabelecimento[]> {
  //  return (
  //    await this.db.all('SELECT estabelecimentos.* FROM estabelecimentos WHERE EXISTS (SELECT estabelecimento_id FROM categorias WHERE categorias.categoria IN ?)',
  //                          categorias)
  //  )
  //    .map(c => (
  //      new Estabelecimento(
  //       c.id,
  //       c.nome,
  //       c.lotacao,
  //       c.pontuacao,
  //       c.precos,
  //    // TODO mudar
  //       [],
  //       c.morada,
  //       {latitude: c.coordenadas.latitude, longitude: c.coordenadas.longitude}, // coordenadas
  //       c.horario_abertura,
  //       c.horario_fecho,
  //       c.contacto)
  //  ))
  //}


  //TODO
    // localizacao -> se for dado vao ser ordenados pela localizacao mais perta
    // gama Preco -> ordenar pelo mais baixo
    // melhor avaliados -> ordenar
    // abertos -> so da os q estao abertos
    // categorias -> a filtrar , se null entao nao ha categorias
  async getByFiltros(localizacao: {latitude: string; longitude: string}| null ,
                     gamaPreco: boolean | null, melhorAvaliados: boolean | null,
                     apenasAbertos: boolean |null, categorias: Categoria[] | null):
  Promise<Estabelecimento[]> {
    if (localizacao == null && gamaPreco == null && categorias == null && melhorAvaliados == null && apenasAbertos == null)
      throw "Não foram dados filtros"

    return [];
  }
}
