const mongo = require('../controllers/mongo');
const ObjectId = require('mongodb').ObjectID;
const { ReturnObject, barbersCollectionName, barbersInfoCollectionName } = require('./constants');

async function getAll(){
    let barbers, result;
    try {
        barbers = await mongo.getDb().collection(barbersCollectionName).find().toArray();
    } catch (error) {
        result = new ReturnObject(
            500,
            {
                'message': 'An error has occurred when trying to access all barbers',
            }
        )
    }
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
            500,
            {
                'message': 'An error has occurred when trying to access all barbers',
            }
        )
    }
    return result
}

async function getUserById(id){
    let barber, result;
    try {
        barber = await mongo.getDb().collection(barbersCollectionName).findOne({
            _id: new ObjectId(id)
        });
    } catch (error) {
        result = new ReturnObject(
            500,
            {
                'message': `An error has occurred when trying to access the barber with id #${id}`,
            }
        )
    }
    if (barber) {
        result = new ReturnObject(
            200,
            {
                'message': `You have successfully accessed  the barber with id #${id}`,
                'data': barber
            }
        )
    } else {
        result = new ReturnObject(
            500,
            {
                'message': `An error has occurred when trying to access the barber with id #${id}`,
            }
        )
    }
    return result
}

async function getUserByUsername(username){
    let barber, result;
    try {
        barber = await mongo.getDb().collection(barbersCollectionName).findOne({
            username
        });
    } catch (error) {
        result = new ReturnObject(
            500,
            {
                'message': `An error has occurred when trying to access the barber with username: #${username}`,
            }
        )
    }
    if (barber) {
        result = new ReturnObject(
            200,
            {
                'message': `You have successfully accessed  the barber with username: #${username}`,
                'data': barber
            }
        )
    } else {
        result = new ReturnObject(
            500,
            {
                'message': `An error has occurred when trying to access the barber with username: #${username}`,
            }
        )
    }
    return result
}

async function addUser(username,email,password){
    let user = await getByUserName(username);
    let newBarber, result;
    if (user == null) {
        try {
            newBarber = await mongo.getDb().collection(barbersCollectionName).insertOne({
                username,
                email,
                password
            })
        } catch (error) {
            result = new ReturnObject(
                500,
                {
                    'message': 'An error has occurred when trying to create a new barber',
                }
            )
        }
        if (newBarber) {
            result = new ReturnObject(
                200,
                {
                    'message': 'New barber successfully created',
                    'data': newbarber
                }
            )
        } else {
            result = new ReturnObject(
                500,
                {
                    'message': 'An error has occurred when trying to create a new barber',
                }
            )
        }
    } else {
        result = new ReturnObject(
            401,
            {
                'message': 'Username has been taken',
            }
        )
    }
    return result
}

async function updateUserInfo(id,address1,address2,postalCode,operatingHours){
    let barber = await getUserById(id);
    let updatedBarberInfo,result;
    if (barber) {
        try {
            updatedBarberInfo = await mongo.getDb().collection(barbersInfoCollectionName).updateOne(
                {
                    _id: new ObjectId(id)
                },
                {
                    '$set': {
                        address1:
                        address2,
                        postalCode,
                        operatingHours
                    }
                }
            )
        } catch (error) {
            result = new ReturnObject(
                500,
                {
                    'message': 'An error has occurred when trying to update barber\'s information',
                }
            )
        }
        if (updatedBarber) {
            result = new ReturnObject(
                200,
                {
                    'message': 'Successfully updated barber\'s information',
                }
            )
        } else {
            result = new ReturnObject(
                500,
                {
                    'message': 'An error has occurred when trying to update barber',
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
    return result
}

async function updateUser(username, email, password) {
    let user = await getByUserName(username);
    let updatedBarber, result;
    if (user) {
        try {
            updatedBarber = await mongo.getDb().collection(barbersCollectionName).updateOne(
                { username },
                {
                    '$set': {
                        username: user.username,
                        email,
                        password
                    }
                }
            )
        } catch (error) {
            result = new ReturnObject(
                500,
                {
                    'message': 'An error has occurred when trying to update barber',
                }
            )
        }
        if (updatedBarber) {
            result = new ReturnObject(
                200,
                {
                    'message': 'Successfully updated barber',
                }
            )
        } else {
            result = new ReturnObject(
                500,
                {
                    'message': 'An error has occurred when trying to update barber',
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
    return result
}

async function deleteUser(id){
    let user = await getUserById(id);
    let deletedBarber, result;
    if (user) {
        try {
            deletedBarber = await mongo.getDb().collection(barbersCollectionName).deleteOne({
                // _id: new ObjectId(id)
                _id: user._id
            })
        } catch (error) {
            result = new ReturnObject(
                500,
                {
                    'message': 'An error has occurred when trying to delete barber',
                }
            )
        }
        if (deletedBarber) {
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
                    'message': 'An error has occurred when trying to delete barber',
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
    return result
}

module.exports = {
    getAll,
    getUserById,
    getUserByUsername,
    addUser,
    updateUserInfo,
    updateUser,
    deleteUser
}
