const mongo = require('../controllers/mongo');
const ObjectId = require('mongodb').ObjectID;

async function getAll(){
    let result = await mongo.getDb().collection('barbers').find().toArray();
    return result
}

async function getUserById(id){
    let result = await mongo.getDb().collection('barbers').findOne({
        _id: new ObjectId(id)
    });
    return result
}

async function getUserByUsername(username){
    let result = await mongo.getDb().collection('barbers').findOne({
        username
    });
    return
}

async function addUser(username,email,password){
    let user = await getByUserName(username);
    if (user == null) {
        let result = await mongo.getDb().collection('barbers').insertOne({
            username,
            email,
            password
        })
    }
}

async function updateUser(username, email, password) {
    let user = await getByUserName(username);
    if (user) {
        let result = await mongo.getDb().collection('barbers').updateOne({
            username
        },
        {
            '$set': {
                username: user.username,
                email,
                password
            }
        })
        return result
    }
}

async function deleteUser(id){
    let user = await getUserById(id);
    if (user) {
        await mongo.getDb().collection('barbers').deleteOne({
            // _id: new ObjectId(id)
            _id: user._id
        })
    }
}
module.exports = {
    getAll,
    getUserById,
    getUserByUsername,
    addUser,
    updateUser,
    deleteUser
}
