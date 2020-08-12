var express = require('express');
var router = express.Router();
const mongo = require('../controllers/mongo');
const ObjectId = require('mongodb').ObjectId;
const uuidv4 = require('uuid/v4');

const queue = require('../controllers/queue');

router.get('/view/:barberid', (req, res, next) => {
    const { barberid } = req.params
});

router.post('/join-queue/:barberid', async(req, res, next) => {
    const { barberid } = req.params;
    const { name } = req.body;

    let newEntry = await queue.joinQueue(name,barberid);
    return res.sendStatus(newEntry.statusCode).json({
        'message':newEntry.message
    });
});

router.get('/leave-queue/:barberid', (req, res, next) => {
    const { barberid } = req.params
    const uID;
    // TODO: X509 Cert Processing to check for or sign another valid x509 cert.
    // TODO: Extract the uID which would be the cert value
    // uID = <output of some function>

    let result = await queue.leaveQueue(uID,barberid)
    return res.sendStatus(newEntry.statusCode).json({
        'message': newEntry.message
    });
});

router.get('/view-barbers', (req, res, next) => {
    const { barberid } = req.params
    const uID;
    // TODO: X509 Cert Processing to check for or sign another valid x509 cert.
    // TODO: Extract the uID which would be the cert value
    // uID = <output of some function>

    let result = await queue.viewQueue(uID,barberid)
    return res.sendStatus(newEntry.statusCode).json({
        'message': newEntry.message,
        'data': result.data
    });
});
