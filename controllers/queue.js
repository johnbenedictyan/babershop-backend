const mongo = require('../mongoUtil');
const ObjectId = require('mongodb').ObjectId
const {
    ReturnObject, QueueObject, queueCollectionName, barbersStatusCollectionName
} = require('./constants');

const { getUserById } = require('./users');

//  Auxiliary Helper Functions
async function queueEntryCheck(customerId, barberId) {
    let db = mongo.getDb();
    let result;
    getUserById(barberId).then((res) => {
        switch (res.statusCode) {
            case 200:
                db.collection(queueCollectionName).findOne({
                    customerId: new ObjectId(customerId),
                    barberId: new ObjectId(barberId)
                }).then((entry) => {
                    if (entry) {
                        result = new ReturnObject(
                            200, {
                                'message': `You have successfully accessed 
                                            queue entry with the customer id
                                            of #${customerId} and the barber
                                            id of #${barberId}. The customer
                                            is in the queue`,
                                'data': entry
                            }
                        )
                    } else {
                        result = new ReturnObject(
                            200, {
                                'message': `No queue entry with the customer
                                            id of #${customerId} and the 
                                            barber id of #${barberId} exist`,
                                'data': null
                            }
                        )
                    }
                }).catch((err) => {
                    result = new ReturnObject(
                        500, {
                            'message': `An error has occurred when trying to 
                                    access the queue entry with the customer
                                    id of #${customerId} and the barber id 
                                    of #${barberId}`
                        }
                    )
                });
                break;
        
            default:
                result = res
                break;
        }
    }).catch((err) => {
        result = new ReturnObject(
            500, 
            {
                'message': `An error has occurred when trying to access the 
                            queue entry with the customer id of #${customerId} 
                            and the barber id of #${barberId}`
            }
        )
    });
    return result
}

async function queueOpenCheck(barberId){
    let db = mongo.getDb();
    let result;
    getUserById(barberId).then((barber) => {
        if (barber) {
            try {
                db.collection(barbersStatusCollectionName).findOne({
                    barberId: new ObjectId(barberId)
                }).then((barberStatus) => {
                    if (barberStatus) {
                        result = new ReturnObject(
                            200, 
                            {
                                'message': `You have successfully accessed 
                                            the barber's status with the id
                                            of #${barberId}`,
                                'data': barberStatus
                            }
                        )
                    } else {
                        result = new ReturnObject(
                            500, 
                            {
                                'message': `This barber does not have a 
                                            status`
                            }
                        )
                    }
                })
            } catch (error) {
                result = new ReturnObject(
                    500, 
                    {
                        'message': `An error has occurred when trying to 
                                    access the status of the barber with the 
                                    id of #${barberId}`
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
                            status of the barber with the id of 
                            #${barberId}`
            }
        )
    });
    return result
}

//  Main Functions
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
                queueOpenCheck(barberId).then((res) => {
                    switch (res.statusCode) {
                        case 200:
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
                                            200, 
                                            {
                                                'message': `You have joined the 
                                                            queue`
                                            }
                                        )
                                    } else {
                                        result = new ReturnObject(
                                            500, 
                                            {
                                                'message': `An error has occured 
                                                            when trying to join 
                                                            the queue`
                                            }
                                        )
                                    }
                                }).catch((err) => {
                                    result = new ReturnObject(
                                        500, 
                                        {
                                            'message': `An error has occured 
                                                        when trying to join the
                                                        queue`
                                        }
                                    )
                                });
                            } catch (err) {
                                result = new ReturnObject(
                                    500, 
                                    {
                                        'message': `An error has occured when 
                                                    trying to join the queue`
                                    }
                                )
                            }
                            break;

                        default:
                            result = res
                            break;
                    }
                }).catch((err) => {
                    result = new ReturnObject(
                        500, 
                        {
                            'message': `An error has occured when trying to join
                                        the queue`
                        }
                    )
                });

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
                queueOpenCheck(barberId).then((res) => {
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
                                    // Check to see if the user is in the queue 
                                    // and to edit the queue payload
                                    queueEntryCheck(
                                        customerId,
                                        barberId
                                    ).then((res) => {
                                        switch (res.statusCode) {
                                            case 200:
                                                let queue = data.map(
                                                    function (entry) {
                                                    return entry.customerId
                                                });

                                                let position = queue.indexOf(
                                                    queueEntry.data.customerId
                                                );

                                                // TODO: Best algorithm f.t.u.c?

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
                                                    200, 
                                                    {
                                                        'message': `You have 
                                                                    successfully 
                                                                    accessed 
                                                                    the queue`,
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
                                                    200, {
                                                        'message': `You have 
                                                                    successfully 
                                                                    accessed 
                                                                    the queue`,
                                                        'data': queueObj
                                                    }
                                                )
                                                break;

                                            default:
                                                result = new ReturnObject(
                                                    500, {
                                                        'message': `An error 
                                                                    occurred 
                                                                    when trying 
                                                                    to access 
                                                                    the queue`
                                                    }
                                                )
                                                break;
                                        }
                                    }).catch((err) => {
                                        result = new ReturnObject(
                                            500, {
                                                'message': `An error occurred 
                                                            when trying to
                                                            access the queue`
                                            }
                                        )
                                    });
                                } else {
                                    result = new ReturnObject(
                                        500, {
                                            'message': `An error occurred when 
                                                        trying to access the 
                                                        queue`
                                        }
                                    )
                                }
                            });
                            break;
                    
                        default:
                            break;
                    }
                }).catch((err) => {
                    result = new ReturnObject(
                        500, {
                            'message': `An error has occured when trying to
                                        access the queue`
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