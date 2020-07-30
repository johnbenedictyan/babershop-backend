class ReturnObject {
    constructor(success, message, payload) {
        this.success = success ? true : false;
    }

    get message() {
        return this._message
    }

    get sucess() {
        return this._success
    }

    get payload() {
        return this._payload
    }
}

module.exports = {
    ReturnObject
}