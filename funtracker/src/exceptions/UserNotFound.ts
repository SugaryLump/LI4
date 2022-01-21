export class UserNotFoundException extends Error {
    constructor(username: string, ...params) {
        super(...params),
        this.name = 'UserNotFoundException'
    }
}
