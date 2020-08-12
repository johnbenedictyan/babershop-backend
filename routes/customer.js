var express = require('express');
var router = express.Router();
const mongo = require('../controllers/mongo');
const ObjectId = require('mongodb').ObjectId;
const jwt = require('../controllers/jwt');
const queue = require('../controllers/queue');

// TODO: Can jwt authorizetoken can be placed in the customer router instead?

router.get(
    '/view/:barberId',
    jwt.authenticateToken,
    (req, res, next) => {
        const { barberId } = req.params
    }
);

router.post(
    '/join-queue/:barberId',
    jwt.authenticateToken,
    async (req, res, next) => {
        const { barberId } = req.params;
        const { name } = req.body;

        let newEntry = await queue.joinQueue(name,barberId);
        return res.sendStatus(newEntry.statusCode).json({
            'message':newEntry.message
        });
    }
);

router.get(
    '/leave-queue/:barberId',
    jwt.authenticateToken,
    (req, res, next) => {
        const { customerId } = req.meta;
        const { barberId } = req.params

        let result = await queue.leaveQueue(customerId, barberId)
        return res.sendStatus(result.statusCode).json({
            'message': result.message
        });
    }
);

router.get(
    '/view-barbers',
    jwt.authenticateToken,
    (req, res, next) => {
        const { customerId } = req.meta;
        const { barberId } = req.params

        let result = await queue.viewQueue(customerId, barberId)
        return res.sendStatus(result.statusCode).json({
            'message': result.message,
            'data': result.data
        });
    }
);
