// Routes relacionadas com utilizadores

import {Router} from 'express';
import {body, validationResult} from 'express-validator';
import {FunTracker} from '../model/FunTracker';
import isLoggedIn from '../middleware/isLoggedIn';
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
    let funtracker: FunTracker = new FunTracker(req.app.get('db'));
    try {
      let user = await funtracker.criarContaUtilizador(req.body.username, req.body.password);
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
  '/createAdmin', isLoggedIn,
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

    const user: UserJwt = getUser(req);
    //FIXME
    if ( //user.id === +req.params.id &&
      user.is_admin) {
      let funtracker: FunTracker = new FunTracker(req.app.get('db'));
      try {
        let user = await funtracker.criarContaAdmin(req.body.username, req.body.password);
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
    } else {
      return res.status(403).json({
        success: false,
        errors: ['Permission Denied'],
      });
    }

  },
);

/* mudar a password */
usersRouter.post(
  '/:id/changePassword',
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
    const user: UserJwt = getUser(req);
    //FIXME
    if (// user.id === +req.params.id ||
      user.is_admin) {
      let funTracker: FunTracker = new FunTracker(req.app.get('db'));

      try {
        funTracker.changePassword(req.body.id, req.body.password);
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

     } else {
       return res.status(403).json({
         success: false,
         errors: ['Permission Denied'],
       });
     }
  },
);

/* mudar o username */
usersRouter.post(
  '/:id/changeUsername', isLoggedIn,
  body('username').exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: false, errors: errors.array()});
    }

    next();
  },
  async (req, res) => {

    const user: UserJwt = getUser(req);
    //FIXME
    if ( // user.id === +req.params.id ||
      user.is_admin) {
      let funTracker: FunTracker = new FunTracker(req.app.get('db'));
      try {
        funTracker.changeUsername(req.body.id, req.body.username);
        return res.status(200).json({success: true});
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
    } else {
      return res.status(403).json({
        success: false,
        errors: ['Permission Denied'],
      });
    }
  },
);

/* Ver histórico */
usersRouter.get('/:id/historico', isLoggedIn, async (req, res) => {
  const user: UserJwt = getUser(req);
  if (user.id === +req.params.id || user.is_admin) {
    return res.status(200).json(FunTracker.getClassificacoesByID(req.body.id));
  } else {
    return res.status(403).json({
      success: false,
      errors: ['Permission Denied'],
    });
  }
});

export default usersRouter;
