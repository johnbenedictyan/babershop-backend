const mongo = require('../controllers/mongo');
const ObjectId = require('mongodb').ObjectID;
const {
    ReturnObject, barbersCollectionName, barbersInfoCollectionName
} = require('./constants');

async function getAll(){
    let db = mongo.getDb();
    let result;
    try {
        db.collection(barbersCollectionName).find().toArray().then((barbers) => {
            if (barbers) {
                result = new ReturnObject(
                    200, 
                    {
                        'message': 'You have successfully accessed all barbers',
                        'data': barbers
                    }
                )
            } else {
                result = new ReturnObject(
                    404, 
                    {
                        'message': `No barbers found`
                    }
                )
            }
        }).catch((err) => {
            result = new ReturnObject(
                500,
                {
                    'message': `An error has occurred when trying to access 
                                all barbers`
                }
            )
        });
    } catch (err) {
        result = new ReturnObject(
            500, 
            {
                'message': `An error has occurred when trying to access 
                                all barbers`
            }
        )
    }
    
    return result
}

async function getUserById(barberId){
    let db = mongo.getDb();
    let result;
    try {
        db.collection(barbersCollectionName).findOne({
            _id: new ObjectId(barberId)
        }).then((barber) => {
            if (barber) {
                result = new ReturnObject(
                    200, 
                    {
                        'message': `You have successfully accessed the barber 
                                    with id #${barberId}`,
                        'data': barber
                    }
                )
            } else {
                result = new ReturnObject(
                    500, 
                    {
                        'message': `An error has occurred when trying to access 
                                    the barber with id #${barberId}`,
                    }
                )
            }
        }).catch((err) => {
            result = new ReturnObject(
                500, 
                {
                    'message': `An error has occurred when trying to access the 
                                barber with id #${barberId}`,
                }
            )
        });
    } catch (err) {
        result = new ReturnObject(
            500,
            {
                'message': `An error has occurred when trying to access the 
                            barber with id #${barberId}`
            }
        )
    }
    return result
}

async function getUserByUsername(username){
    let db = mongo.getDb();
    let result;
    try {
        db.collection(barbersCollectionName).findOne({
            username
        }).then((barber) => {
            if (barber) {
                result = new ReturnObject(
                    200, {
                        'message': `You have successfully accessed the barber 
                                    with the username - ${username}`,
                        'data': barber
                    }
                )
            } else {
                result = new ReturnObject(
                    500, 
                    {
                        'message': `An error has occurred when trying to access 
                                    the barber with the username - ${username}`
                    }
                )
            }
        }).catch((err) => {
            result = new ReturnObject(
                500, 
                {
                    'message': `An error has occurred when trying to access the 
                                barber with the username - ${username}`
                }
            )
        });
    } catch (err) {
        result = new ReturnObject(
            500, 
            {
                'message': `An error has occurred when trying to access the 
                            barber with the username - ${username}`
            }
        )
    }
    return result
}

async function addUser(username, password) {
    let result;
    let db = mongo.getDb();
    try {
        getByUserName(username).then((user) => {
            if (user) {
                result = new ReturnObject(
                    401, 
                    {
                        'message': 'Username has been taken',
                    }
                )
            } else {
                try {
                    db.collection(barbersCollectionName).insertOne({
                        username,
                        password
                    }).then((barber) => {
                        if (barber) {
                            result = new ReturnObject(
                                200, 
                                {
                                    'message': `Your account has been 
                                                successfully created`,
                                    'data': barber
                                }
                            )
                        } else {
                            result = new ReturnObject(
                                500, 
                                {
                                    'message': `An error has occurred when 
                                                trying to create your account`
                                }
                            )
                        }
                    }).catch((err) => {
                        result = new ReturnObject(
                            500, 
                            {
                                'message': `An error has occurred when trying to 
                                        create a new barber`
                            }
                        )
                    });
                } catch (err) {
                    result = new ReturnObject(
                        500, 
                        {
                            'message': `An error has occurred when trying to 
                                        create a new barber`
                        }
                    )
                }
            }
        }).catch((err) => {
            result = new ReturnObject(
                500, 
                {
                    'message': `An error has occurred when trying to create a 
                                new barber`
                }
            )
        });
    } catch (err) {
        result = new ReturnObject(
            500,
            {
                'message': `An error has occurred when trying to create a new 
                            barber`
            }
        )
    }
    return result
}

async function addUserInfo(
    barberId, email, address1, address2, postalCode, operatingHours
) {
    try {
        db.collection(
            barbersInfoCollectionName
        ).insertOne({
            barberId,
            email,
            address1,
            address2,
            postalCode,
            operatingHours
        }).then((barberInfo) => {
            if (barberInfo) {
                result = new ReturnObject(
                    200, 
                    {
                        'message': `Your account info has been successfully 
                                    added`,
                        'data': barberInfo
                    }
                )
            } else {
                result = new ReturnObject(
                    500, 
                    {
                        'message': `An error has occurred when trying to add 
                                    your account info`
                    }
                )
            }
        }).catch((err) => {
            result = new ReturnObject(
                500, 
                {
                    'message': `An error has occurred when trying to add 
                                your account info`
                }
            )
        });
    } catch (err) {
        result = new ReturnObject(
            500, 
            {
                'message': `An error has occurred when trying to add 
                                    your account info`
            }
        )
    }
    return result
}

async function updateUserInfo(
    barberId, email, address1, address2, postalCode, operatingHours
) {
    let db = mongo.getDb();
    let result;
    try {
        getUserById().then((barber) => {
            if (barber) {
                try {
                    db.collection(barbersInfoCollectionName).updateOne({
                        _id: new ObjectId(barberId)
                    },
                    {
                        '$set': {
                            email,
                            address1,
                            address2,
                            postalCode,
                            operatingHours
                        }
                    }).then((updatedBarber) => {
                        result = new ReturnObject(
                            200, 
                            {
                                'message': `Successfully updated barber's 
                                            information`
                            }
                        )
                    }).catch((err) => {
                        result = new ReturnObject(
                            500, 
                            {
                                'message': `An error has occurred when trying to 
                                            update barber's information`
                            }
                        )
                    });
                } catch (err) {
                    result = new ReturnObject(
                        500, {
                            'message': `An error has occurred when trying to 
                                        update barber's information`
                        }
                    )
                }
            } else {
                result = new ReturnObject(
                    404, 
                    {
                        'message': 'This barber does not exist',
                    }
                )
            }
        }).catch((err) => {
            result = new ReturnObject(
                500, 
                {
                    'message': `An error has occurred when trying to update 
                                barber's information`
                }
            )
        });
    } catch (err) {
        result = new ReturnObject(
            500, 
            {
                'message': `An error has occurred when trying to update 
                            barber's information`
            }
        )
    }
    return result
}

async function updateUser(barberId, username, password) {
    let db = mongo.getDb();
    let result;
    try {
        getUserById(barberId).then((barber) => {
            if (barber){
                try {
                    db.collection(barbersCollectionName).updateOne({
                        _id: new ObjectId(barberId)
                    }, {
                        '$set': {
                            username,
                            password
                        }
                    }).then((updatedBarber) => {
                        if (updatedBarber) {
                            result = new ReturnObject(
                                200, {
                                    'message': 'Successfully updated barber',
                                }
                            )
                        } else {
                            result = new ReturnObject(
                                500, 
                                {
                                    'message': `An error has occurred when 
                                                trying to update this barber`
                                }
                            )
                        }
                    }).catch((err) => {
                        result = new ReturnObject(
                            500, 
                            {
                                'message': `An error has occurred when trying 
                                            to update this barber`
                            }
                        )
                    });
                } catch (err) {
                    result = new ReturnObject(
                        500, 
                        {
                            'message': `An error has occurred when trying to 
                                        update this barber`
                        }
                    )
                }
            } else {
                result = new ReturnObject(
                    404, 
                    {
                        'message': 'This barber does not exist',
                    }
                )
            }
        }).catch((err) => {
            result = new ReturnObject(
                500, {
                    'message': `An error has occurred when trying to update this 
                                barber`
                }
            )
        });
    } catch (err) {
        result = new ReturnObject(
            500, 
            {
                'message': `An error has occurred when trying to update this 
                            barber`
            }
        )
    }
    return result
}

async function deleteUser(barberId){
    let db = mongo.getDb();
    let result;
    try {
        getUserById(barberId).then((barber) => {
            if (barber) {
                try {
                    db.collection(barbersCollectionName).deleteOne({
                        _id:barber._id
                    }).then((deletedBarber) => {
                        if (deletedBarber){
                            result = new ReturnObject(
                                200, 
                                {
                                    'message': 'Successfully deleted barber',
                                }
                            )
                        } else {
                            result = new ReturnObject(
                                500, 
                                {
                                    'message': `An error has occurred when 
                                                trying to delete this barber`
                                }
                            )
                        }
                    }).catch((err) => {
                        result = new ReturnObject(
                            500, 
                            {
                                'message': `An error has occurred when trying to
                                            delete this barber`
                            }
                        )
                    });
                } catch (err) {
                    result = new ReturnObject(
                        500, 
                        {
                            'message': `An error has occurred when trying to 
                                        delete this barber`
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
        }).catch((err) => {
            result = new ReturnObject(
                500, 
                {
                    'message': `An error has occurred when trying to delete this
                                barber`
                }
            )
        });
    } catch (err) {
        result = new ReturnObject(
            500, 
            {
                'message': `An error has occurred when trying to delete this
                            barber`
            }
        )
    }
    return result
}

async function deleteUserInfo(barberId){
    let db = mongo.getDb();
    let result;
    try {
        getUserById(barberId).then((barber) => {
            if (barber){
                try {
                    db.collection(barbersInfoCollectionName).deleteOne({
                        barberId: new ObjectId(barberId)
                    }).then((deletedBarberInfo) => {
                        if (deletedBarberInfo){
                            result = new ReturnObject(
                                200, 
                                {
                                    'message': `Successfully deleted barber's
                                                info`   
                                }
                            )
                        } else {
                            result = new ReturnObject(
                                500, 
                                {
                                    'message': `An error has occurred when 
                                                trying to delete this barber's
                                                info`
                                }
                            )
                        }
                    }).catch((err) => {
                        result = new ReturnObject(
                            500, 
                            {
                                'message': `An error has occurred when trying to
                                            delete this barber's info`
                            }
                        )
                    });
                } catch (err) {
                    result = new ReturnObject(
                        500, 
                        {
                            'message': `An error has occurred when trying to 
                                        delete this barber's info`
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
                    'message': `An error has occurred when trying to delete this
                                barber's info`
                }
            )
        });
    } catch (err) {
        result = new ReturnObject(
            500, 
            {
                'message': `An error has occurred when trying to delete this
                            barber's info`
            }
        )
    }
    return result
}

module.exports = {
    getAll,
    getUserById,
    getUserByUsername,
    addUser,
    addUserInfo,
    updateUserInfo,
    updateUser,
    deleteUser,
    deleteUserInfo
}
