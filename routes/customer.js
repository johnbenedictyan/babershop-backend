var express = require('express');
var router = express.Router();
const mongo = require('../controllers/mongo');
const ObjectId = require('mongodb').ObjectId

router.get('/view/:barberid', (req, res, next) => {
    const { barberid } = req.params
});

router.post('/join-queue/:barberid', (req, res, next) => {
    const { barberid } = req.params
});

router.get('/leave-queue/:barberid', (req, res, next) => {
    const { barberid } = req.params
});

router.get('/view-barbers', (req, res, next) => {
    const { barberid } = req.params
});
