export class LocalNoturnoNotFound extends Error {
    id: number

    constructor(id: number, ...params) {
        super(...params),
        this.id = id,
        this.name = 'Local Noturno not found'
    }
}
