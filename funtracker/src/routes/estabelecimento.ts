import { Router } from "express";
import { Estabelecimento } from "../model/Estabelecimento";
import { body, validationResult } from "express-validator";
import isLoggedIn from '../middleware/isLoggedIn';
import { FunTracker } from '../model/FunTracker'

const estabelecimentoRouter = Router()

estabelecimentoRouter.get('/all', isLoggedIn,async (req, res) => {
    const estab : Estabelecimento[] = await FunTracker.getEstabelecimentos()
    if(estab) {
        return res.status(200).json(estab)
    }
    else {
        res.status(404).send("Database Error");
    }
})

estabelecimentoRouter.get('/:id', isLoggedIn, async (req, res) => {
    let info_local = await FunTracker.getEstabelecimentoByID(parseInt(req.params.id))
    if(info_local) {
        return res.status(200).json(info_local)
    }
    else {
        res.status(404).send("Bar não existe");
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

export default estabelecimentoRouter
