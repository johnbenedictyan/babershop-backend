const mongo = require('../mongoUtil');
const ObjectId = require('mongodb').ObjectId
const { ReturnObject } = require('./constants');

function barberCheck(barberid){
    let db = mongo.getDb;
    db.collection('barbers')
    .findOne({
        '_id': ObjectId(id)
    })
    .toArray()
    .then((data) => {
        return data
    });
}

function queueEntryCheck(){
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
}

async function joinQueue(name,barberid){
    let db = mongo.getDb();
    let barber = barberCheck(barberid);
    let rObj;
    if (barber) {
        // TODO: Add the queueEntryCheck function here.

        let newEntry = {
            name,
            barberid,
            'uID': '<queueEntryCheck output of the x509 cert value>',
            'time': '<current time>'
        }

        db
        .collection('barbers')
        .insertOne(newEntry)
        .then((id) => {
            if (id) {
                rObj = new ReturnObject(
                    true,
                    `You have joined ${barber.name}'s queue`
                )
            } else {
                rObj = new ReturnObject(
                    false,
                    'An error has occured when trying to join the queue'
                )
            }
        });
    } else {
        rObj = new ReturnObject(
            false,
            'This barber does not exist'
        )
    }
    return rObj
}

async function leaveQueue(uID,barberid){
    let db = mongo.getDb();
    let barber = barberCheck(barberid);
    let rObj;
    if (barber) {
        // TODO: Add the queueEntryCheck function here.

        db
        .collection('barbers')
        .deleteOne({
            uID,
            barberid
        })
        .then((data) => {
            if (data==1) {
                rObj = new ReturnObject(
                    true,
                    `You have left ${barber.name}'s queue`
                )
            } else {
                rObj = new ReturnObject(
                    false,
                    'An error has occured when trying to leave the queue'
                )
            }
        });
    } else {
        rOrObj = new ReturnObject(
            false,
            'This barber does not exist'
        )
    }
    return rObj
}

async function viewQueue(uID, barberid){
    let db = mongo.getDb();
    let barber = barberCheck(barberid);
    let rObj;
    if (barber) {
        // TODO: Add the queueEntryCheck function here.

        db
        .collection('barbers')
        .find({
            barberid
        })
        .sort({
            'time': 1
        })
        .toArray()
        .then((data) => {
            if (data) {
                rObj = new ReturnObject(
                    true,
                    `You have successfully accessed ${baber.name}'s queue`,
                    data
                )
            } else {
                rObj = new ReturnObject(
                    false,
                    `An error occurred when trying to access ${baber.name}'s queue`
                )
            }
        });
    } else {
        rObj = new ReturnObject(
            false,
            'This barber does not exist'
        )
    }
    return rObj
}