module.exports = class Error {
    #message;
    constructor(message) {
        this.#message = message;
    }

    get message() {
        return this.#message;
    }
};