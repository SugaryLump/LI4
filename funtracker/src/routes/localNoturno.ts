import { Router } from "express";

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

export default localNoturnoRouter
