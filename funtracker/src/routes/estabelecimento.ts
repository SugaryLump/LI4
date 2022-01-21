import { Router } from "express";
import { Estabelecimento } from "../model/Estabelecimento";
import { body, validationResult } from "express-validator";
import isLoggedIn from '../middleware/isLoggedIn';
import { FunTracker } from '../model/FunTracker'
import {UserJwt, getUser} from '../middleware/isLoggedIn'

const estabelecimentoRouter = Router()

estabelecimentoRouter.get('/all', isLoggedIn,async (req, res) => {
    try {
        const estab : Estabelecimento[] = await FunTracker.getEstabelecimentos()
        return res.status(200).json(estab)
    }
    catch(e) {
        res.status(500).send(e);
    }
})

estabelecimentoRouter.get('/:id', isLoggedIn, async (req, res) => {
    try {
        let infoLocal = await FunTracker.getEstabelecimentoByID(+req.params.id)
        if(infoLocal) {
            return res.status(200).json(infoLocal)
        }
        else {
             return res.status(404).send("Estabelecimento Não Existe")
        }
    }
    catch(e) {
        res.status(500).send(e)
    }
})

estabelecimentoRouter.get('/:id/allImagens', isLoggedIn, async (req, res) => {
    let allImagens = await FunTracker.getAllImagensByEstabelecimentoID(req.body.id)
    if(allImagens) {
        return res.status(200).json(allImagens)
    }
    else {
        res.status(404).send("Não existem imagens associadas");
    }
})

// Maybe mandar mesmo a imagem, fazer dowload dela e devolver o filepath
estabelecimentoRouter.get('/:id/adicionarImagem', isLoggedIn,
  body('filepath')
      .exists(),
  async (req, res) => {
    let newImagen = FunTracker.adicionarImagen(req.body.id,req.body.filepath)
    if(newImagen) {
        return res.status(200).json(newImagen)
    }
    else {
        res.status(404).send("Não foi possível adicionar a imagem");
    }
})

estabelecimentoRouter.get('/:id/classificacoes', isLoggedIn, async (req, res) => {
  const user: UserJwt = getUser(req);
  if (user.id === +req.params.id || user.is_admin) {
    return res.status(200).json(FunTracker.getClassificacoesByEstabelecimentoID(req.body.id));
  } else {
    return res.status(403).json({
      success: false,
      errors: ['Permission Denied'],
    });
  }
});

export default estabelecimentoRouter
