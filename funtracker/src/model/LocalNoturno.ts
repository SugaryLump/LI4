export enum GamaPreco {
    Low = "$",
    Medium = "$$",
    High "$$$"
}

export type Local = {
    id: number
    nome: string
    lotacao: number
    rating: number
    gamaPreco: GamaPreco
    morada: string
    coordenadas: Coordinates
    horarioAbertura: Date
    horarioFecho: Date
    contacto: string
}

// caller must increment numberRatings
function updateRating(newRating: number, numberRatings: number): void {
    let sum : number = this.rating * numberRatings
    this.rating = (sum + newRating)/(numberRatings + 1)
}
