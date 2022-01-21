import { Router } from "express";
import { Estabelecimento } from "../model/Estabelecimento";
import { body, validationResult } from "express-validator";
import { FunTracker } from '../model/FunTracker'

const estabelecimentoRouter = Router()

estabelecimentoRouter.get('/all', async (req, res) => {
    const estab : Estabelecimento[] = await FunTracker.getEstabelecimentos()
    if(estab) {
        return res.status(200).json(estab)
    }
    else {
        res.status(404).send("Database Error");
    }
})

estabelecimentoRouter.get('/:id', async (req, res) => {
    let info_local = await FunTracker.getEstabelecimentoByID(parseInt(req.params.id))
    if(info_local) {
        return res.status(200).json(info_local)
    }
    else {
        res.status(404).send("Bar não existe");
    }
})

export default estabelecimentoRouter
