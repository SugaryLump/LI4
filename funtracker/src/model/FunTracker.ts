import {UserDAO, User} from './User';
import {Classificacao, ClassificacaoDAO} from './Classificacao';
import {EstabelecimentoDAO, Estabelecimento} from './Estabelecimento';

import {PromisedDatabase} from 'promised-sqlite3';

export class FunTracker {
  private static db: PromisedDatabase;
  private static users: UserDAO;
  private static classificacaoDAO: ClassificacaoDAO;
  private static estabelecimentoDAO: EstabelecimentoDAO;
  constructor(db: PromisedDatabase) {
    FunTracker.db = db;
    FunTracker.users = new UserDAO(db);
    FunTracker.classificacaoDAO = new ClassificacaoDAO(db);
    FunTracker.estabelecimentoDAO = new EstabelecimentoDAO(db);
  }

  /* USERS */
  async iniciarSessao(username: string, password: string): Promise<User> {
    return FunTracker.users.login(username, password);
  }

  async criarContaUtilizador(
    username: string,
    password: string,
  ): Promise<User> {
    return FunTracker.users.createUser(username, password);
  }

  async criarContaAdmin(username: string, password: string): Promise<User> {
    return FunTracker.users.createAdmin(username, password);
  }

  async changePassword(userId: number, newPassword: string): Promise<void> {
    return FunTracker.users.changePassword(userId, newPassword);
  }

  async changeUsername(userId: number, newUsername: string): Promise<void> {
    return FunTracker.users.changeUsername(userId, newUsername);
  }

  async checkIfIsAdmin(userId: number): Promise<boolean> {
    return FunTracker.users.isAdmin(userId);
  }

  /* Estabelecimentos */
  // TODO
  async criarEstabelecimento(): Promise<null> {
    return null;
  }

  static async getEstabelecimentoByID(id: number): Promise<Estabelecimento | null> {
      return FunTracker.estabelecimentoDAO.getByID(id)
  }

  static async getEstabelecimentos(): Promise<Estabelecimento[]> {
      return await FunTracker.estabelecimentoDAO.getAll();
  }

  async avaliar(
    valor: number,
    comentario: string | null,
    estabelecimentoNoturnoId: number,
    utilizadorId: number,
  ): Promise<Classificacao> {
    // atualizar o rating do local Noturno
    FunTracker.estabelecimentoDAO.avaliar(valor, estabelecimentoNoturnoId);
    return FunTracker.classificacaoDAO.createClassificacao(
      valor,
      comentario,
      estabelecimentoNoturnoId,
      utilizadorId,
    );
  }

  // TODO faz sequer sentido??
  async atualizarLocalizacao(userId: number): Promise<boolean> {
    return true;
  }

  static async getClassificacoesByID(userID: number) {
    return FunTracker.classificacaoDAO.getClassificacoesByID(userID);
  }
}
