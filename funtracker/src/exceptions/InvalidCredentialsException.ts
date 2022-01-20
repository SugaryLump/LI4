export class InvalidCredentialsExceptions extends Error {
    constructor(username: string, ...params) {
        super(...params),
        this.name = 'UserAlreadyExists'
    }
}
