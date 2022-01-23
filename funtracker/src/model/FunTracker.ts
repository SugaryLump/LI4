import {UserDAO, User}  from './User'
import {Classificacao, ClassificacaoDAO}  from './Classificacao'
import {Ordem,GamaPreco,Categoria, Estabelecimento, EstabelecimentoDAO}  from './Estabelecimento'
import {Imagem, ImagensDAO} from './Imagem'

import {PromisedDatabase} from 'promised-sqlite3';

export class FunTracker {
        private static db: PromisedDatabase
        private static users: UserDAO
        private static classificacaoDAO: ClassificacaoDAO
        private static estabelecimentoDAO: EstabelecimentoDAO
        private static imagemDAO: ImagensDAO
constructor(db: PromisedDatabase) {FunTracker.db = db;
            FunTracker.users = new UserDAO(db);
            FunTracker.classificacaoDAO = new ClassificacaoDAO(db);
            FunTracker.estabelecimentoDAO = new EstabelecimentoDAO(db);
            FunTracker.imagemDAO = new ImagensDAO(db);
        }

  /* USERS */
  static async iniciarSessao(username: string, password: string): Promise<User> {
    return FunTracker.users.login(username, password);
  }

  static async criarContaUtilizador(
    username: string,
    password: string,
  ): Promise<User> {
    return FunTracker.users.createUser(username, password);
  }

  static async criarContaAdmin(username: string, password: string): Promise<User> {
    return FunTracker.users.createAdmin(username, password);
  }

  static async changePassword(userId: number, newPassword: string): Promise<void> {
      return FunTracker.users.changePassword(userId, newPassword)
  }

  static async changeUsername(userId: number, newUsername: string): Promise<void> {
    return FunTracker.users.changeUsername(userId, newUsername)
  }

  static async checkIfIsAdmin(userId: number): Promise<boolean> {
    return FunTracker.users.isAdmin(userId);
  }

  static async getAllUsers(): Promise<User[]> {
    return FunTracker.users.allUsers()
  }

  static async getUserById(userId: number): Promise<User> {
    return FunTracker.users.getById(userId)
  }


  /* Estabelecimentos */
  // TODO

    static async criaEstabelecimento(
    nome: string,
    lotacao: number,
    classificacao: number,
    gamaPreco: keyof typeof GamaPreco ,
    nomes_categorias: (keyof typeof Categoria) [],
    morada: string,
    coordenadas: {latitude: string; longitude: string},
    horarioAbertura: string,
    horarioFecho: string,
    contacto: string,
  ): Promise<Estabelecimento> {


      const abertura : Date = new Date();
      let [hours,minutes] : String[] = horarioAbertura.split(":")
      abertura.setHours(+hours)
      abertura.setMinutes(+minutes)
      const fecho : Date = new Date();
      [hours,minutes] = horarioFecho.split(":")
      fecho.setHours(+hours)
      fecho.setMinutes(+minutes)
      let categorias : (Categoria|undefined)[] = nomes_categorias.map(c => Categoria[c])
      const preco: GamaPreco = GamaPreco[gamaPreco]
      if(preco == undefined ||  categorias.includes(undefined) ) {
          throw "Dados introduzidos são inválidos"
      }
      else {
          return await FunTracker
            .estabelecimentoDAO
            .cria(nome,lotacao,classificacao,preco, <Categoria[]> categorias,morada,coordenadas,abertura,fecho,contacto)
          }
  }

  static async getEstabelecimentoByID(id: number): Promise<Estabelecimento> {
      return FunTracker.estabelecimentoDAO.getByID(id)
  }

  static async getEstabelecimentos(): Promise<Estabelecimento[]> {
      return await FunTracker.estabelecimentoDAO.getAll();
  }

  static async avaliar(
    valor: number,
    comentario: string | null,
    estabelecimentoNoturnoId: number,
    utilizadorId: number,
  ): Promise<Classificacao> {
    await FunTracker.estabelecimentoDAO.avaliar(valor, estabelecimentoNoturnoId);
    return await FunTracker.classificacaoDAO.createClassificacao(
      valor,
      comentario,
      estabelecimentoNoturnoId,
      utilizadorId,
    );
  }

  static async adicionarCategoria(estabelecimento_id: number, nome_categoria: (keyof typeof Categoria) ,
): Promise<{categoria: Categoria, estabelecimento_id: number}> {
      let categoria: (Categoria|undefined) = Categoria[nome_categoria]
      if (categoria == undefined)
          throw "Categoria não existe"
      else {
          return await FunTracker.estabelecimentoDAO.adicionarCategoria(categoria,estabelecimento_id)
      }
  }

  static async getClassificacoesByUserID(userID: number) {
    return FunTracker.classificacaoDAO.getClassificacoesByUserID(userID);
  }

  static async getClassificacoesByEstabelecimentoID(estabelecimentoId: number) {
    return FunTracker.classificacaoDAO.getClassificacoesByEstabelecimentoId(estabelecimentoId);
  }

    /* Imagens */
  static async adicionarImagen(estabelecimentoId: number, filepath: string): Promise<Imagem> {
      return FunTracker.imagemDAO.addImagem(estabelecimentoId, filepath)
  }

  static async getAllImagensByEstabelecimentoID(estabelecimetoId: number): Promise<Imagem[]> {
      return FunTracker.imagemDAO.getAllByEstabelecimentoID(estabelecimetoId)
  }

    /* Filtros */
    static async getEstabelecimentosBySortedCategorias(): Promise<Estabelecimento[]> {
        return await FunTracker.estabelecimentoDAO.getSortByCategorias()
    }

    static async getEstabelecimentosBySortedPontuacao(): Promise<Estabelecimento[]> {
        return await FunTracker.estabelecimentoDAO.getSortByPontuacao()
    }

    static async getEstabelecimentosBySortedPreco(): Promise<Estabelecimento[]> {
        return await FunTracker.estabelecimentoDAO.getSortByPrecos()
    }

    static async getEstabelecimentosAbertos(): Promise<Estabelecimento[]> {
        return await FunTracker.estabelecimentoDAO.getOpenEstabelecimentos()
    }

    static async getEstabelecimentosByGamaPreco(gamaPreco: keyof typeof GamaPreco): Promise<Estabelecimento[]> {
      const preco: GamaPreco = GamaPreco[gamaPreco]
      if(preco == undefined ) {
          throw "Gama de Preco inválida"
      }
        return await FunTracker.estabelecimentoDAO.getByGamaPreco(preco)
    }

  //TODO nao sei se funciona
    static async getByFiltros(apenasAbertos: boolean| null, order: keyof typeof Ordem | null, gamaPreco:keyof typeof GamaPreco | null): Promise<Estabelecimento[]> {
      let ordem: Ordem | null = null
      if(order != null) {
       let aux: Ordem | undefined = Ordem[order]
        if (aux == undefined)
          throw "Ordem é inválida"
        ordem = aux
      }
      let preco: GamaPreco | null = null
      if(gamaPreco != null) {
       let aux: GamaPreco | undefined = GamaPreco[gamaPreco]
        if (preco == undefined)
          throw "GamaPreco é inválida"
        preco = aux
      }
      return await FunTracker.estabelecimentoDAO.getByFiltros(apenasAbertos,ordem,preco)
    }
}
