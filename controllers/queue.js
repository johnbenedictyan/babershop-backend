const mongo = require('../mongoUtil');
const ObjectId = require('mongodb').ObjectId
const {
    ReturnObject, QueueObject, barbersCollectionName, queueCollectionName
} = require('./constants');

const { getUserById } = require('./users');

async function queueEntryCheck(customerId, barberId) {
    // Look into node-forge and the use of x509 certificates

    // When the user serves up the webpage, the B.E. will sign a x509 cert and pass 
    // it to the user. We will then store the x509 cert in the session or cookie data.
    // When a user tries to join the queue, the B.E. should first try to verfiy the x509
    // cert. If the cert cannot be verified, then a new cert must be issued.

    // Once the verification process is completed, the B.E should look into the db and see
    // if the cert value which will act as the P.K. for the entries table exist.

    // If the P.K. exist aka the user is already in the queue, then insertOne to insert
    // another entry should not occur. An error should not occur, the user should simply 
    // see the words 'you have joined the queue' or 'you are already in the queue'.

    // We are basically using x509 certs as P.K.s because I don't want to require user sign
    // up and log in just so that we can stop multiple queue entries from the same user.

    let db = mongo.getDb();
    let result;
    try {
        getUserById(barberId).then((barber) => {
            if (barber) {
                try {
                    db.collection(barbersCollectionName).findOne({
                        customerId: new ObjectId(customerId),
                        barberId: new ObjectId(barberId)
                    }).then((existingEntry) => {
                        if (existingEntry) {
                            result = new ReturnObject(
                                200, 
                                {
                                    'message': `You have successfully accessed 
                                                queue entry with the customer id
                                                of #${customerId} and the barber
                                                id of #${barberId}`,
                                    'data': barber
                                }
                            )
                        } else {
                            result = new ReturnObject(
                                404, 
                                {
                                    'message': `No queue entry with the customer
                                                id of #${customerId} and the 
                                                barber id of #${barberId} exist`
                                }
                            )
                        }
                    })
                } catch (error) {
                    result = new ReturnObject(
                        500, 
                        {
                            'message': `An error has occurred when trying to access the 
                            queue entry with the customer id of #${customerId} 
                            and the barber id of #${barberId}`
                        }
                    )
                }
            } else {
                result = new ReturnObject(
                    404, 
                    {
                        'message': `This barber does not exist`
                    }
                )
            }
        }).catch((err) => {
            result = new ReturnObject(
                500, 
                {
                    'message': `An error has occurred when trying to access the 
                                queue entry with the customer id of 
                                #${customerId} and the barber id of 
                                #${barberId}`
                }
            )
        });
    } catch (err) {
        result = new ReturnObject(
            500, 
            {
                'message': `An error has occurred when trying to access the 
                            queue entry with the customer id of #${customerId} 
                            and the barber id of #${barberId}`
            }
        )
    }
    return result
}

async function joinQueue(name, barberId, customerId){
    let db = mongo.getDb();
    let result;
    queueEntryCheck(customerId, barberId).then((res) => {
        switch (res.statusCode) {
            case 200:
                result = new ReturnObject(
                    200, 
                    {
                        'message': `You have joined ${barber.name}'s queue`
                    }
                )
                break;
            
            case 404:
                switch (res.message) {
                    case `This barber does not exist`:
                        result = res
                        break;
                
                    default:
                        let time = new Date(0);
                        let newEntry = {
                            name,
                            barberId: new ObjectId(barberId),
                            customerId: new ObjectId(customerId),
                            time
                        }
                        try {
                            db.collection(queueCollectionName).insertOne(
                                newEntry
                            ).then((id) => {
                                if (id) {
                                    result = new ReturnObject(
                                        200, {
                                            'message': `You have joined the 
                                                        queue`
                                        }
                                    )
                                } else {
                                    result = new ReturnObject(
                                        500, {
                                            'message': `An error has occured 
                                                        when trying to join the
                                                        queue`
                                        }
                                    )
                                }
                            }).catch((err) => {
                                result = new ReturnObject(
                                    500, {
                                        'message': `An error has occured when 
                                                    trying to join the queue`
                                    }
                                )
                            });
                        } catch (err) {
                            result = new ReturnObject(
                                500, {
                                    'message': `An error has occured when trying
                                                to join the queue`
                                }
                            )
                        }
                        break;
                }
                break;

            default:
                result = new ReturnObject(
                    500, 
                    {
                        'message': `An error has occured when trying to join the
                                    queue`
                    }
                )
                break;
        }
    }).catch((err) => {
        result = new ReturnObject(
            500, 
            {
                'message': `An error has occured when trying to join the 
                            queue`
            }
        )
    });
    return result
}

async function leaveQueue(customerId, barberId) {
    let db = mongo.getDb();
    let result;
    getUserById(barberId).then((res) => {
        switch (res.statusCode) {
            case 200:
                let barber = result.data;
                queueEntryCheck(customerId,barberId).then((res) => {
                    switch (res.statusCode) {
                        case 200:
                            db.collection(queueCollectionName).deleteOne({
                                customerId: new ObjectId(customerId),
                                barberId: new ObjectId(barberId)
                            }).then((res) => {
                                switch (res) {
                                    case 1:
                                        result = new ReturnObject(
                                            200, {
                                                'message': `You have left 
                                                            ${barber.name}'s 
                                                            queue`
                                            }
                                        )
                                        break;

                                    default:
                                        result = new ReturnObject(
                                            500, {
                                                'message': `An error has occured
                                                            when trying to leave
                                                            the queue`
                                            }
                                        )
                                        break;
                                }
                            }).catch((err) => {
                                result = new ReturnObject(
                                    500, {
                                        'message': `An error has occured when 
                                                    trying to leave the queue`
                                    }
                                )
                            });
                            break;
                        
                        case 404:
                            result = new ReturnObject(
                                200,
                                {
                                    'message': `You have left ${barber.name}'s 
                                                queue`
                                }
                            )
                            break;

                        default:
                            result = new ReturnObject(
                                500, {
                                    'message': `An error has occured when trying
                                                to leave the queue`
                                }
                            )
                            break;
                    }
                }).catch((err) => {
                    result = new ReturnObject(
                        500, {
                            'message': `An error has occured when trying to 
                                        leave the queue`
                        }
                    )
                });
                break;
            
            case 404:
                result = new ReturnObject(
                    404, 
                    {
                        'message': 'This barber does not exist'
                    }
                )
                break;

            default:
                result = new ReturnObject(
                    500, 
                    {
                        'message': `An error has occured when trying to leave 
                                    the queue`
                    }
                )
                break;
        }
    }).catch((err) => {
        result = new ReturnObject(
            500, 
            {
                'message': `An error has occured when trying to leave the queue`
            }
        )
    });
    return result
}

async function viewQueue(customerId, barberId, userType) {
    let db = mongo.getDb();
    let result;
    getUserById(barberId).then((res) => {
        switch (res.statusCode) {
            case 200:
                let barber = res.data;
                db.collection(queueCollectionName).find({
                    barberId: new ObjectId(barberId)
                }).sort({
                    'time': 1
                }).toArray().then((data) => {
                    if (data) {
                        let queueObj;
                        // Check to see if the user is in the queue and to edit 
                        // the queue payload
                        queueEntryCheck(customerId, barberId).then((res) => {
                            switch (res.statusCode) {
                                case 200:
                                    let queue = data.map(function (entry) {
                                        return entry.customerId
                                    });

                                    let position = queue.indexOf(
                                        queueEntry.data.customerId
                                    );

                                    // TODO: Find out the best algorithm f.t.u.c

                                    if (position != -1) {
                                        queueObj = new QueueObject(
                                            data,
                                            userType,
                                            true,
                                            position
                                        )
                                    } else {
                                        queueObj = new QueueObject(
                                            data,
                                            userType,
                                            false
                                        )
                                    }
                                    result = new ReturnObject(
                                        200, {
                                            'message': `You have successfully 
                                                        accessed 
                                                        ${barber.name}'s queue`,
                                            'data': queueObj
                                        }
                                    )
                                    break;

                                case 404:
                                    queueObj = new QueueObject(
                                        data,
                                        userType,
                                        false
                                    )
                                    result = new ReturnObject(
                                        200, 
                                        {
                                            'message': `You have successfully 
                                                        accessed 
                                                        ${barber.name}'s queue`,
                                            'data': queueObj
                                        }
                                    )
                                    break;

                                default:
                                    result = new ReturnObject(
                                        500, 
                                        {
                                            'message': `An error occurred when 
                                                        trying to access 
                                                        ${barber.name}'s queue`
                                        }
                                    )
                                    break;
                            }
                        }).catch((err) => {
                            result = new ReturnObject(
                                500, 
                                {
                                    'message': `An error occurred when trying to
                                                access ${barber.name}'s queue`
                                }
                            )
                        });
                    } else {
                        rObj = new ReturnObject(
                            500, {
                                'message': `An error occurred when trying to 
                                            access ${barber.name}'s queue`
                            }
                        )
                    }
                });
                break;
            
            case 404:
                result = new ReturnObject(
                    404, 
                    {
                        'message': 'This barber does not exist'
                    }
                )
                break;

            default:
                result = new ReturnObject(
                    500,
                    {
                        'message': `An error occurred when trying to find this
                                    barber`
                    }
                )
                break;
        }
    }).catch((err) => {
        result = new ReturnObject(
            500, 
            {
                'message': `An error occurred when trying to find this barber`
            }
        )
    });
    return result
}

async function kickFromQueue(customerId, barberId) {
    let db = mongo.getDb();
    let barber = barberCheck(barberId);
    let kickedCustomer, result;
    if (barber) {
        // TODO: Add the queueEntryCheck function here.
        if (condition) {
            try {
                kickedCustomer = db.collection(queueCollectionName).deleteOne({
                    customerId,
                    barberId
                })
            } catch (error) {
                result = new ReturnObject(
                    500,
                    {
                        'message': `An error has occurred when trying to kick 
                                    this customer from the queue`
                    }
                )
            }
            if (kickedCustomer) {
                result = new ReturnObject(
                    200,
                    {
                        'message': 'This user has been kicked from the queue'
                    }
                )
            } else {
                result = new ReturnObject(
                    500,
                    {
                        'message': `An error has occurred when trying to kick
                                    this customer from the queue`
                    }
                )
            }
        } else {
            result = new ReturnObject(
                404,
                {
                    'message': 'This user was not in the queue'
                }
            )
        }
    } else {
        result = new ReturnObject(
            404,
            {
                'message': 'This barber does not exist'
            }
        )
    }
    return result
}

async function closeQueue(barberId){
    let db = mongo.getDb();
    let barber = barberCheck(barberId);
    let updatedBarber, result;
    if (barber) {
        try {
            updatedBarber = db.collection(queueCollectionName).update(
                { username: barber.username },
                {
                    '$set': {
                        queueOpened: false
                    }
                }
            )
        } catch (error) {
            result = new ReturnObject(
                500,
                {
                    'message': `An error has occurred when trying to close 
                                this barber's queue`
                }
            )
        }
        if (updatedBarber) {
            result = new ReturnObject(
                200,
                {
                    'message': 'This barber is now closed'
                }
            )
        } else {
            result = new ReturnObject(
                500,
                {
                    'message': `An error has occurred when trying to close 
                                this barber's queue`
                }
            )
        }
    } else {
        result = new ReturnObject(
            404,
            {
                'message': 'This barber does not exist'
            }
        )
    }
    return result
}

module.exports = {
    joinQueue,
    leaveQueue,
    viewQueue,
    kickFromQueue,
    closeQueue
};