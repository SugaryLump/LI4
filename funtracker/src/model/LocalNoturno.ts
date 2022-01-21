import { PromisedDatabase } from "promised-sqlite3"
import {LocalNoturnoNotFound} from '../exceptions/index'

export class LocalNoturno  {
    constructor(
        private readonly id: number,
        private nome: string,
        private lotacao: number,
        private rating: number,
        private gamaPreco: GamaPreco,
        private morada: string,
        private coordenadas: {latitude: number, longitude: number },
        private horarioAbertura: Date,
        private horarioFecho: Date,
        private contacto: string,
    ) {}

    // caller must increment numberRatings
    updateRating(newRating: number, numberRatings: number): number {
        const sum : number = this.rating * numberRatings
        return this.rating = (sum + newRating)/(numberRatings + 1)
    }
}

export enum Categoria {
    Bar,
    Discoteca
}

export enum GamaPreco {
    Low = "$",
    Medium = "$$",
    High = "$$$"
}

export class LocalNoturnoDao {
    constructor(
        private readonly db: PromisedDatabase
    ) {}

    async avaliar(valor: number, estabelecimentoNoturnoId: number): Promise<number> {
            // ir buscar o local Noturno
            // verificar o any
            let localNoturno: LocalNoturno | null = null as any
            if (localNoturno == null)
                throw new LocalNoturnoNotFound(estabelecimentoNoturnoId)
            // FIXME
            let numberRatings = 0
            return localNoturno.updateRating(valor, numberRatings)
    }
}
