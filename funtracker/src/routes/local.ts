import { Router } from "express";

const localRouter = Router()

const local = new Map([
    [1,{nome: "BA", morada: "Rua Nova Santa Cruz", rating: 5 }],
    [2,{nome: "Tropical", morada: "Rua Nova Santa Cruz", rating: 4.3 }],
    [3,{nome: "Carpe", morada: "Rua Nova Santa Cruz", rating: 3.1 }]
])

localRouter.get('/:id', async (req, res) => {
    let info_local = local.get(parseInt(req.params.id))
    if(info_local) {
        return res.status(200).json(info_local)
    }
    else {
        res.status(404).send("Bar não existe");
    }
})

export default localRouter
