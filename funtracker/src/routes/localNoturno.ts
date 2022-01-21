import { Router } from "express";
import { body, validationResult } from "express-validator";
import { FunTracker } from '../model/FunTracker'

const localNoturnoRouter = Router()

const local = new Map([
    [1,{nome: "BA", categoria: "Bar",morada: "Rua Nova Santa Cruz", rating: 5 }],
    [2,{nome: "Tropical", categoria: "Bar", morada: "Rua Nova Santa Cruz", rating: 4.3 }],
    [3,{nome: "Carpe", categoria: "Bar", morada: "Rua Nova Santa Cruz", rating: 3.1 }]
])

localNoturnoRouter.get('/:id', async (req, res) => {
    let info_local = local.get(parseInt(req.params.id))
    if(info_local) {
        return res.status(200).json(info_local)
    }
    else {
        res.status(404).send("Bar não existe");
    }
})

// TODO
localNoturnoRouter.get('/all', async (req, res) => {
    let allLocais = null
    if(allLocais) {
        return res.status(200).json(allLocais)
    }
    else {
        res.status(404).send("Não existem bares");
    }
})

export default localNoturnoRouter
