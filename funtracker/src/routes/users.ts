// Routes relacionadas com utilizadores

import {Request, Router} from 'express';
import {body, validationResult} from 'express-validator';
import {FunTracker} from '../model/FunTracker';
import isLoggedIn from '../middleware/isLoggedIn';
import {hasPermission, isAdmin} from '../middleware/hasPermission';
import {UserJwt, getUser} from '../middleware/isLoggedIn'

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
  '/createAdmin', isLoggedIn, isAdmin,
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
usersRouter.post(
  '/:id/changePassword', isLoggedIn, hasPermission,
  body('password')
    .exists()
    .isLength({min: 8})
    .withMessage('Must be at least 8 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: false, errors: errors.array()});
    }

    next();
  },
  async (req, res) => {
      try {
        await FunTracker.changePassword(req.params?.id, req.body.password);
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
usersRouter.post(
  '/:id/changeUsername', isLoggedIn, hasPermission ,
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
          return res.status(200).json({success: true, username: req.body.username});
      } catch (error: any) {
        if (error.errno == 19) {
          // Erro 19 é o erro de uma constraint falhada
          error = 'Username already exists';
        }
        return res.status(400).json({
          success: false,
          errors: [error],
        });
      }
  },
);

usersRouter.get('/all', isLoggedIn, isAdmin, async (req, res) => {
  const user: UserJwt = getUser(req);
    try {
      let users = await FunTracker.getAllUsers()
      let allSimpleUsers = users.map(c => ({
        id: c.id,
        username: c.username,
        isAdmin: c.isAdmin
      }))
      return res.status(200).json({success: true, users: allSimpleUsers})
    } catch(error: any) {
      return res.status(400).json({
        success: false,
        errors: [error],
      });
    }
});

usersRouter.get('/:id', isLoggedIn, hasPermission, async (req, res) => {
      let user = await FunTracker.getUserById(+req.params.id);
      return res
        .status(200)
        .json({success: true, user: {username: user.username, id: user.id}});
});

usersRouter.get('/:id/historico', isLoggedIn, hasPermission, async (req, res) => {
    return res.status(200).json(FunTracker.getClassificacoesByUserID(+req.params.id));
});

export default usersRouter;
