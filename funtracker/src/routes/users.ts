// Routes relacionadas com utilizadores

import {Request, Router} from 'express';
import { body, param, query, validationResult} from 'express-validator';
import {FunTracker} from '../model/FunTracker';
import isLoggedIn from '../middleware/isLoggedIn';
import {hasPermission, isAdmin, isSpecial} from '../middleware/hasPermission';
import { checkValidation } from '../middleware/checkValidation';

const usersRouter = Router();

/* registar um utilizador normal */
usersRouter.post(
  '/',
  body('password')
    .exists()
    .isLength({min: 8})
    .withMessage('Must be at least 8 characters long'),
  body('username').exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: false, errors: errors.array()});
    }

    next();
  },
  async (req, res) => {
    try {
      let user = await FunTracker.criarContaUtilizador(req.body.username, req.body.password);
      return res
        .status(200)
        .json({success: true, user: {username: user.username, id: user.id}});
    } catch (error:  any) {
      if (error.errno == 19) {
        // Erro 19 é o erro de uma constraint falhada
        error = 'This user already exists';
      }
      return res.status(400).json({
        success: false,
        errors: [error],
      });
    }
  },
);

/* registar um admin */
usersRouter.post(
  '/criarAdmin',
  body('password')
    .exists()
    .isLength({min: 8})
    .withMessage('Must be at least 8 characters long'),
  body('username').exists(), isLoggedIn, isAdmin,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: false, errors: errors.array()});
    }
    next();
  },
  async (req, res) => {
    try {
      let user = await FunTracker.criarContaAdmin(req.body.username, req.body.password);
      return res
        .status(200)
        .json({success: true, user: {username: user.username, id: user.id}});
    } catch (error:  any) {
      if (error.errno == 19) {
        // Erro 19 é o erro de uma constraint falhada
        error = 'This user already exists';
      }
      return res.status(400).json({
        success: false,
        errors: [error],
      });
    }
  },
);

/* mudar a password */
usersRouter.patch(
  '/:id/password', isLoggedIn, hasPermission, isSpecial,
  body('password')
    .exists()
    .isLength({min: 8})
    .withMessage('Must be at least 8 characters long'),
  checkValidation,
  async (req, res) => {
      try {
        await FunTracker.changePassword(+req.params?.id, req.body.password);
        return res.status(200).json({success: true});
      } catch (error: any) {
        if (error.errno == 19) {
          // Erro 19 é o erro de uma constraint falhada
          error = 'Password not changed';
        }
        return res.status(400).json({
          success: false,
          errors: [error],
        });
      }
  },
);

/* mudar o username */
usersRouter.patch(
  '/:id/username', isLoggedIn, hasPermission, isSpecial,
  body('username').exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: false, errors: errors.array()});
    }

    next();
  },
  async (req: Request, res) => {
      try {
          await FunTracker.changeUsername(+req.params.id, req.body.username);
          return res.status(200).json({
            success: true,
            username: req.body.username,
          });
      } catch (error: any) {
        if (error.errno == 19) {
          // Erro 19 é o erro de uma constraint falhada
          error = 'Username already exists';
        }
        return res.status(403).json({
          success: false,
          errors: [error],
        });
      }
  },
);

usersRouter.get('/', isLoggedIn, isAdmin, async (req, res) => {
    try {
      let users = await FunTracker.getAllUsers()
      let allSimpleUsers = users.map(c => ({
        id: c.id,
        username: c.username,
        isAdmin: c.isAdmin
      }))
      return res.status(200).json({success: true, users: allSimpleUsers})
    } catch(error: any) {
      return res.status(404).json({
        success: false,
        errors: [error],
      });
    }
});


usersRouter.get('/:id', isLoggedIn, hasPermission, async (req, res) => {
  try {
    let user = await FunTracker.getUserById(+req.params.id);
    return res
      .status(200)
      .json({ success: true, user: { username: user.username, id: user.id } });
  } catch {
    return res.status(404).json({
      success: false,
      errors: ["User não existe"],
    });
  }
});

usersRouter.get('/:id/historico', isLoggedIn, hasPermission, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      historico: await FunTracker.getClassificacoesByUserID(+req.params.id)
    });
  } catch {
    return res.status(404).json({
      success: false,
      errors: ["Utilizador ainda não tem histórico"],
    });
  }
});

usersRouter.delete(
  '/:id',
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const n = +req.params.id
      if (isNaN(n)) {
        return res.status(400).json({
          success: false,
          errors: ["Invalid ID"],
        });
      }
        await FunTracker.removeUserByID(n)
      return res.status(200).json({success:true , id: `Utilizador com ID ${req.params.id} removido`})
    } catch {
      return res.status(404).json({
        success: false,
        errors: ["Não Existe Nenhum Utilizador com esse ID"],
      });
    }
  })

export default usersRouter;
