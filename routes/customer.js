var express = require('express');
var router = express.Router();
const mongo = require('../controllers/mongo');
const ObjectId = require('mongodb').ObjectId;
const jwt = require('../controllers/jwt');
const queue = require('../controllers/queue');

// TODO: Can jwt authorizetoken can be placed in the customer router instead?

router.get(
    '/view/:barberid',
    jwt.authenticateToken,
    (req, res, next) => {
        const { barberid } = req.params
    }
);

router.post(
    '/join-queue/:barberid',
    jwt.authenticateToken,
    async (req, res, next) => {
        const { barberid } = req.params;
        const { name } = req.body;

        let newEntry = await queue.joinQueue(name,barberid);
        return res.sendStatus(newEntry.statusCode).json({
            'message':newEntry.message
        });
    }
);

router.get(
    '/leave-queue/:barberid',
    jwt.authenticateToken,
    (req, res, next) => {
        const { customerId } = req.meta;
        const { barberid } = req.params

        let result = await queue.leaveQueue(customerId, barberid)
        return res.sendStatus(newEntry.statusCode).json({
            'message': newEntry.message
        });
    }
);

router.get(
    '/view-barbers',
    jwt.authenticateToken,
    (req, res, next) => {
        const { customerId } = req.meta;
        const { barberid } = req.params

        let result = await queue.viewQueue(customerId, barberid)
        return res.sendStatus(newEntry.statusCode).json({
            'message': newEntry.message,
            'data': result.data
        });
    }
);
