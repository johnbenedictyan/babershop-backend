class ReturnObject {
    constructor(statusCode, payload) {
        this.statusCode = statusCode;
        this.payload = payload;
    }

    get statusCode() {
        return this.statusCode
    }

    get data() {
        if (this._payload.data){
            return this._payload.data
        }
    }

    get message() {
        if (this._payload.message) {
            return this._payload.message
        } 
    }
}

class QueueObject {
    constructor(queue, userType, userInQueue, userPosition){
        this.queue = queue;
        this.userInQueue = userInQueue;
        this.userPosition = userPosition;
        this.userType = userType
    }

    get userInQueue() {
        return this.userInQueue
    }

    get userPosition() {
        return this.userPosition
    }

    get queue() {
        return this.queue
    }
}

// Constant Variables
const rootCollectionName = 'barbershop';
const queueCollectionName = 'queue';
const barbersCollectionName = 'barbers';

module.exports = {
    ReturnObject,
    QueueObject,
    rootCollectionName,
    queueCollectionName,
    barbersCollectionName
}