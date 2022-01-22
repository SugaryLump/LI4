import { Router } from "express";
import { Estabelecimento } from "../model/Estabelecimento";
import { body } from "express-validator";
import isLoggedIn from '../middleware/isLoggedIn';
import {hasPermission,isAdmin} from '../middleware/hasPermission';
import { FunTracker } from '../model/FunTracker'
import {UserJwt, getUser} from '../middleware/isLoggedIn'

const estabelecimentoRouter = Router()

estabelecimentoRouter.get('/', isLoggedIn, async (req, res) => {
    try {
        const estab : Estabelecimento[] = await FunTracker.getEstabelecimentos()
        return res.status(200).json(estab)
    }
    catch(e) {
        res.status(500).send(e);
    }
})

estabelecimentoRouter.get('/:id', isLoggedIn, hasPermission, async (req, res) => {
    try {
        let infoLocal = await FunTracker.getEstabelecimentoByID(+req.params.id)
        if(infoLocal) {
            return res.status(200).json(infoLocal)
        }
        else {
             return res.status(404).send("Não Existe Nenhum Estabelecimento")
        }
    }
    catch(e) {
        res.status(500).send(e)
    }
})

estabelecimentoRouter.get('/:id/allImagens', isLoggedIn, hasPermission, async (req, res) => {
    let allImagens = await FunTracker.getAllImagensByEstabelecimentoID(req.body.id)

    if(allImagens) {
        return res.status(200).json(allImagens)
    }
    else {
        res.status(404).send("Não existem imagens associadas");
    }
})

// Maybe mandar mesmo a imagem, fazer dowload dela e devolver o filepath
estabelecimentoRouter.post('/:id/adicionarImagem', isLoggedIn, isAdmin,
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

estabelecimentoRouter.get('/:id/classificacoes', isLoggedIn, isAdmin, async (req, res) => {
    return res.status(200).json(FunTracker.getClassificacoesByEstabelecimentoID(req.body.id));
});

estabelecimentoRouter.post('/:id/avaliar', isLoggedIn, hasPermission,
  body('valor').exists(),
  body('comentario').exists(),
  async (req, res) => {
    const user: UserJwt = getUser(req);
    let newClassificacao = FunTracker.avaliar(+req.body.valor, req.body.comentario, +req.params?.id,user.id)
    if(newClassificacao) {
        return res.status(200).json(newClassificacao)
    }
    else {
        res.status(404).send("Não foi possível classificar o estabelecimento");
    }
})

export default estabelecimentoRouter
