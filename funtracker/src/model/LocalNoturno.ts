import {Coordinates} from './Coordinates'

export class Local  {
    constructor(
        private id: number,
        private nome: string,
        private lotacao: number,
        private rating: number,
        private gamaPreco: GamaPreco,
        private morada: string,
        private coordenadas: Coordinates,
        private horarioAbertura: Date,
        private horarioFecho: Date,
        private contacto: string,
    ) {}

    // caller must increment numberRatings
    updateRating(newRating: number, numberRatings: number): void {
        let sum : number = this.rating * numberRatings
        this.rating = (sum + newRating)/(numberRatings + 1)
    }
}

export enum GamaPreco {
    Low = "$",
    Medium = "$$",
    High = "$$$"
}

