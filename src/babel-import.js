export default class BabelClass {
    constructor(name) {
        this.name = name
    }

    getName() {
        return this.name
    }

    throwError() {
        throw new Error('Error here!')
    }
}
