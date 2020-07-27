var express = require('express');
var router = express.Router();
const mongo = require('../controllers/mongo');
const ObjectId = require('mongodb').ObjectId


router.post('/barbers/sign-up', function(req, res, next) {
  res.send('sign up');
});

router.post('/barbers/sign-in', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/barbers/shop/open', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/barbers/shop/close', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/customer/join', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/customer/leave', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/customer/view', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
