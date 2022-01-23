import { PromisedDatabase  } from 'promised-sqlite3';

export class Estabelecimento {
  constructor(
    public id: number,
    public nome: string,
    public lotacao: number,
    public rating: number,
    public gamaPreco: string,
    public morada: string,
    public coordenadas: { latitude: string, longitude: string },
    public contacto: string
  ) { } // caller must increment numberRatings

  public categorias: string[] = []
  public horarioAbertura: Date = new Date()
  public horarioFecho: Date = new Date()
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

export enum Ordem {
  Proximidade,
  Criticas,
  Precos,
}

export class EstabelecimentoDAO {
  constructor(private readonly db: PromisedDatabase) { }

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
  async removeByID(id: number): Promise<boolean> {
    return (await this.db.run('DELETE from estabelecimentos where id = ?', id)).changes == 1;
  }


  async getAll(): Promise<Estabelecimento[]> {
    let estabelecimentos: Estabelecimento[] = []

    let c = await this.db.each('SELECT * from estabelecimentos', [], (row: any) => {
      const coords: string = row.coordenadas.split(";")
      const est: Estabelecimento = new Estabelecimento(row.id, row.nome, row.lotacao, row.pontuacao, GamaPreco[row.precos], row.morada, { latitude: coords[0], longitude: coords[1] }, row.contacto)
      estabelecimentos.push(est)
    });

    await Promise.all(estabelecimentos.map(async c => {
      const categorias: string[] = await this.db.all('SELECT categoria FROM categorias WHERE estabelecimento_id = ?', c.id)
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
    coordenadas: { latitude: string; longitude: string },
    horarioAbertura: Date,
    horarioFecho: Date,
    contacto: string,
  ): Promise<Estabelecimento> {

    const buildTime = (date: Date) => {
      let leadingZero = (str: number) => { return ("0" + str).slice(-2) }
      return `${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}`
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
      `INSERT INTO estabelecimentos
        (nome, lotacao, pontuacao, morada, coordenadas, precos, horario_abertura, horario_fecho, contacto)
       VALUES (?, ?, ?, ?, ?, ?,  strftime('%H:%M',?), strftime('%H:%M',?), ?)`,
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

    const insert_categoria = (last_id: number, category_name: string) => {
      return this.db.run("INSERT INTO categorias(estabelecimento_id,categoria) VALUES (?,?)", last_id, category_name)
    }

    const categorias_names: string[] = categorias.map(c => Categoria[c])
    categorias_names.forEach(c => insert_categoria(res.lastID, c))

    let est = new Estabelecimento(
      res.lastID,
      nome,
      lotacao,
      rating,
      GamaPreco[gamaPreco],
      morada,
      coordenadas,
      contacto
    )

    est.setCategorias(categorias_names)
    est.setHorarioAbertura(horarioAbertura)
    est.setHorarioFecho(horarioFecho)

    return est
  }

  public async adicionarCategoria(categoria: Categoria, estabelecimento_id: number): Promise<{ categoria: Categoria, estabelecimento_id: number }> {
    if (await this.db.exists("categorias", "categoria = ? AND estabelecimento_id = ?", categoria, estabelecimento_id)) {
      throw "Categoria já existe"
    }
    await this.db.run("INSERT INTO categorias (estabelecimento_id, categoria) VALUES (?,?)", estabelecimento_id, categoria)
    return {
      categoria: categoria,
      estabelecimento_id: estabelecimento_id
    }
  }


  //TODO verificar
  async getByGamaPreco(gamaPreco: GamaPreco): Promise<Estabelecimento[]> {
    return (
      await this.db.all('SELECT * FROM estabelecimentos where precos=?', gamaPreco)
    )
      .map(c => this.convertDBtoEstabelecimento(c))
  }

  //TODO verificar
  async getSortByPrecos(): Promise<Estabelecimento[]> {
    return (
      await this.db.all('SELECT * FROM estabelecimentos ORDER BY precos ASC')
    )
      .map(c => this.convertDBtoEstabelecimento(c))
  }

  //TODO ordenado do mais perto para o mais longe
  public async getBySortLocalizacao(localizacao: { latitude: string; longitude: string }
  ): Promise<Estabelecimento[]> {
    return [];
  }

  // TODO verificar
  async getSortByPontuacao(): Promise<Estabelecimento[]> {
    return (
      await this.db.all('SELECT * FROM estabelecimentos ORDER BY pontuacao DESC')
    ).map(c => this.convertDBtoEstabelecimento(c))
  }

  // TODO verificar
  async getSortByCategorias(): Promise<Estabelecimento[]> {
    return (
      await this.db.all('SELECT estabelecimentos.* , categorias.categoria FROM estabelecimentos LEFT JOIN categorias ON categorias.estabelecimento_id = categorias.estabelecimento_id')
    ).map(c => this.convertDBtoEstabelecimento(c))
  }

  //TODO verificar
  private async getByCategorias(categorias: Categoria[]): Promise<Estabelecimento[]> {
    return (
      await this.db.all('SELECT estabelecimentos.* FROM estabelecimentos WHERE EXISTS (SELECT estabelecimento_id FROM categorias WHERE categorias.categoria IN ?)',
        categorias)
    ).map(c => this.convertDBtoEstabelecimento(c))
  }


  //TODO testar
  async getByFiltros(apenasAbertos: boolean | null, order: Ordem | null, gamaPreco: GamaPreco | null):
    Promise<Estabelecimento[]> {
    // gamaPreco= GamaPreco.$$
    if (order == null && apenasAbertos == null)
      throw "Não foram dados filtros"
    let query = 'SELECT * FROM estabelecimentos '
    let number = 0
    if (apenasAbertos != null && apenasAbertos) {
      number++
      query = query + 'WHERE ( horario_abertura > horario_fecho AND (horario_abertura <= strftime(\'%H:%M\',?) OR horario_fecho > strftime(\'%H:%M\',?) )) OR (horario_abertura <= strftime(\'%H:%M\',?) AND horario_fecho > strftime(\'%H:%M\',?))'
    }

    if (gamaPreco) {
      if (number != 0)
        query += ' AND '
      else
        query += ' WHERE '

      query += 'precos=?'
    }

    if (order != null) {
      switch (order) {
        case Ordem.Precos: {
          query += 'ORDER BY precos ASC'
          break;
        }
        case Ordem.Criticas: {
          query += 'ORDER BY pontuacao DESC'
          break;
        }
        // TODO localizacao
      }
    }

    const dataAgora = new Date()
    const data = dataAgora.getHours() + ':' + dataAgora.getMinutes()

    // console.log(query)
    let resul;
    if (apenasAbertos != null && gamaPreco != null && apenasAbertos) {
      // console.log("1")
      resul = await this.db.all(query, data, gamaPreco)
    }
    else if (gamaPreco != null && (apenasAbertos == null || !apenasAbertos)) {
      // console.log("2")
      resul = await this.db.all(query, gamaPreco)
    }
    else if (apenasAbertos != null && apenasAbertos && gamaPreco == null) {
      // console.log("3")
      resul = await this.db.all(query, data)
    } else {
      // console.log("4")
      resul = await this.db.all(query)
    }

    let estabelecimentos: Estabelecimento[] =  resul.map(c => this.convertDBtoEstabelecimento(c))
    await Promise.all(estabelecimentos.map(async c => {
      const categorias: string[] = await this.db.all('SELECT categoria FROM categorias WHERE estabelecimento_id = ?', c.id)
      c.setCategorias(categorias)
    }))
    return estabelecimentos
  }

  async getOpenEstabelecimentos(): Promise<Estabelecimento[]> {
    const dataAgora = new Date()
    const data = dataAgora.getHours() + ':' + dataAgora.getMinutes()
    return (
      await this.db.all('SELECT * FROM estabelecimentos WHERE ( horario_abertura > horario_fecho AND (horario_abertura <= strftime(\'%H:%M\',?) OR horario_fecho > strftime(\'%H:%M\',?) )) OR (horario_abertura <= strftime(\'%H:%M\',?) AND horario_fecho > strftime(\'%H:%M\',?))',
        data)
    ).map(c => this.convertDBtoEstabelecimento(c))
  }

  private convertDBtoEstabelecimento(c: any): Estabelecimento {
        const coords = c.coordenadas.split(";")
        let e = new Estabelecimento(
          c.id,
          c.nome,
          c.lotacao,
          c.pontuacao,
          GamaPreco[c.precos],
          c.morada,
          // c.coordenadas
          { latitude: coords[0], longitude: coords[1] },
          c.contacto
        )
        e.horarioAbertura = c.horario_abertura
        e.horarioFecho = c.horario_fecho
        e.categorias = []
        return (e)
  }
}
