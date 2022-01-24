import { PromisedDatabase } from 'promised-sqlite3';

export class Estabelecimento {
  constructor(
    public id: number,
    public nome: string,
    public lotacao: number,
    public rating: number,
    public gamaPreco: string,
    public morada: string,
    public coordenadas: { latitude: string, longitude: string },
    public contacto: string,
  ) { } // caller must increment numberRatings

  public categorias: string[] = []
  public horarioAbertura: Date = new Date()
  public horarioFecho: Date = new Date()
  public imageUrls: string[] = []
  public numberRatings: number = 0
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
    let numberRatings: number = await this.countClassificacoes(estabelecimentoId);
    const sum: number = estabelecimento.rating * numberRatings;
    const rating = (sum + valor) / (numberRatings + 1);
    await this.db.run("UPDATE estabelecimentos SET pontuacao = ? WHERE id = ?", rating, estabelecimentoId)
    return rating;
  }

  async numberClassificacoes(id: number): Promise<number> {
    return await this.countClassificacoes(id);
  }

  private async countClassificacoes(estabelecimentoId: number): Promise<number> {
    let row = await this.db.get("SELECT COUNT(*) as count FROM avaliacoes where  estabelecimento_id = ? ", estabelecimentoId)
    return row.count;
  }

  async getByID(id: number): Promise<Estabelecimento> {
    let row = await this.db.get(
      `SELECT estabelecimentos.*, group_concat(filepath) AS filepath, group_concat(categoria) AS categorias
       FROM estabelecimentos
       LEFT JOIN imagens ON imagens.estabelecimento_id = estabelecimentos.id
       LEFT JOIN categorias ON categorias.estabelecimento_id = estabelecimentos.id
       WHERE estabelecimentos.id = ?
       GROUP BY imagens.estabelecimento_id`, id);
    const coords: string[] = row.coordenadas.split(";")
    const imagens: string[] = row.filepath.split(",")
    const est: Estabelecimento = new Estabelecimento(row.id, row.nome, row.lotacao, row.pontuacao, GamaPreco[row.precos], row.morada, { latitude: coords[0], longitude: coords[1] }, row.contacto)
    est.imageUrls = imagens
    est.setCategorias(row.categorias.split(","))
    est.numberRatings = await this.countClassificacoes(id)
    est.setHorarioAbertura(row.horario_abertura)
    est.setHorarioFecho(row.horario_fecho)
    return est
  }

  async removeByID(id: number): Promise<boolean> {
    let resul = (await this.db.run('DELETE from estabelecimentos where id = ?', id)).changes == 1;
    (await this.db.run('DELETE from categorias where estabelecimento_id = ?', id))
    return resul
  }

  async getByName(name: string): Promise<Estabelecimento[]> {
    let estabelecimentos: Estabelecimento[] = []
    await this.db.each(
      `SELECT estabelecimentos.*, group_concat(filepath) AS filepath, group_concat(categoria) AS categorias, COUNT(a.user_id) AS nCriticas
       FROM estabelecimentos
       LEFT JOIN imagens ON imagens.estabelecimento_id = estabelecimentos.id
       LEFT JOIN categorias ON categorias.estabelecimento_id = estabelecimentos.id
       LEFT JOIN avaliacoes a ON estabelecimentos.id = a.estabelecimento_id
       WHERE estabelecimentos.nome = ?
       GROUP BY imagens.estabelecimento_id`, [name], (row: any) => {
      const coords: string[] = row.coordenadas.split(";")
      const imagens: string[] = row.filepath.split(",")
      const est: Estabelecimento = new Estabelecimento(row.id, row.nome, row.lotacao, row.pontuacao, GamaPreco[row.precos], row.morada, { latitude: coords[0], longitude: coords[1] }, row.contacto)
      est.imageUrls = imagens
      est.setCategorias(row.categorias.split(","))
      est.setHorarioAbertura(row.horario_abertura)
      est.setHorarioFecho(row.horario_fecho)
      est.numberRatings = row.nCriticas
      estabelecimentos.push(est)
       });
    return estabelecimentos
  }

  async getAll(): Promise<Estabelecimento[]> {
    let estabelecimentos: Estabelecimento[] = []
    await this.db.each(
      `SELECT estabelecimentos.*,
        (SELECT group_concat(categoria) FROM categorias WHERE categorias.estabelecimento_id = estabelecimentos.id) AS categorias,
        (SELECT group_concat(filepath) FROM imagens WHERE imagens.estabelecimento_id = estabelecimentos.id) AS filepath,
        (SELECT COUNT(*) FROM categorias WHERE categorias.estabelecimento_id = estabelecimentos.id) AS nCriticas
       FROM estabelecimentos
      `, [], (row: any) => {
      const coords: string[] = row.coordenadas.split(";")
      const imagens: string[] = row.filepath.split(",")
      const est: Estabelecimento = new Estabelecimento(row.id, row.nome, row.lotacao, row.pontuacao, GamaPreco[row.precos], row.morada, { latitude: coords[0], longitude: coords[1] }, row.contacto)
      est.imageUrls = imagens
      est.setCategorias(row.categorias.split(","))
      est.setHorarioAbertura(row.horario_abertura)
      est.setHorarioFecho(row.horario_fecho)
      est.numberRatings = row.nCriticas
      estabelecimentos.push(est)
    });

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

  async getByFiltros(
      apenasAbertos: boolean | null,
      order: Ordem | null,
      gamaPreco: GamaPreco | null,
      coordenadas: { latitude: string, longitude: string } | null,
      categorias: Categoria[] | null
    ):
    Promise<Estabelecimento[]> {

    let proximidade = false
    let resul: any[] = [];
    let query =
      `SELECT estabelecimentos.*,
          (SELECT group_concat(categoria) FROM categorias WHERE categorias.estabelecimento_id = estabelecimentos.id) AS categorias,
          (SELECT group_concat(filepath) FROM imagens WHERE imagens.estabelecimento_id = estabelecimentos.id) AS filepath,
          (SELECT COUNT(*) FROM categorias WHERE categorias.estabelecimento_id = estabelecimentos.id) AS nCriticas
       FROM estabelecimentos `
    let number = 0
    if (apenasAbertos != null && apenasAbertos) {
      number++
      const dataAgora = new Date()
      const data = dataAgora.getHours() + ':' + dataAgora.getMinutes()
      console.log( data)
      resul.push(data)
      resul.push(data)
      resul.push(data)
      resul.push(data)
      query = query + 'WHERE ( horario_abertura > horario_fecho AND (horario_abertura <= strftime(\'%H:%M\',?) OR horario_fecho > strftime(\'%H:%M\',?) )) OR (horario_abertura <= strftime(\'%H:%M\',?) AND horario_fecho > strftime(\'%H:%M\',?))'
    }

    if (gamaPreco!=null) {
      if (number != 0)
        query += ' AND '
      else
        query += ' WHERE '

      query += ' precos=? '
      resul.push(gamaPreco)
    }

    if (categorias!=null) {
      if (number != 0)
        query += ' AND '
      else
        query += ' WHERE '

      query += ' categorias.categoria in ('
      let first = true
      categorias.forEach(e => {
        if(!first) {
          query += ','
        }
        first = false
        query += ' \"' + Categoria[e] +'\"'
      })
      query += ')  '
    }

    query += `GROUP BY imagens.estabelecimento_id `

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
        case Ordem.Proximidade: {
          proximidade = true;
          break;
        }
      }
    }

    let estabelecimentos: Estabelecimento[] = []
    await this.db.each(query
      , resul, async (row: any) => {
        const coords: string[] = row.coordenadas.split(";")
        const imagens: string[] = row.filepath.split(",")
        const est: Estabelecimento = new Estabelecimento(row.id, row.nome, row.lotacao, row.pontuacao, GamaPreco[row.precos], row.morada, { latitude: coords[0], longitude: coords[1] }, row.contacto)
        est.imageUrls = imagens
        est.setCategorias(row.categorias.split(","))
        est.setHorarioAbertura(row.horario_abertura)
        est.setHorarioFecho(row.horario_fecho)
        est.numberRatings = row.nCriticas
        estabelecimentos.push(est)
      });

    if (proximidade) {
      if (coordenadas == null || coordenadas === undefined)
        throw "Coordenadas inválidas"
      else
        estabelecimentos = estabelecimentos.sort(e => this.orderByProximidade(e, coordenadas))
    }

    return estabelecimentos
  }

  orderByProximidade(estabelecimento: Estabelecimento, coord: { latitude: string, longitude: string },): number {
    const eLatitude = estabelecimento.coordenadas.latitude
    const eLongitude = estabelecimento.coordenadas.longitude

    const a = +coord.latitude - +eLatitude
    const b = +coord.longitude - +eLongitude

    return Math.sqrt(a * a + b * b)
  }
}
