var express = require('express');
var router = express.Router();
const mongo = require('../controllers/mongo');
const queue = require('../controllers/queue');
const ObjectId = require('mongodb').ObjectId
const barbers = require('../controllers/users');
const passport = require('passport');

router.get('/view-queue', (req, res, next) => {
    let newQueue = queue.viewQueue(null,null,barber)
    return res.sendStatus(newQueue.statusCode).json({
        'message': newQueue.message
    });
});

router.get('/kick-from-queue', (req, res, next) => {

});

router.get('/close-queue',(req,res,next) => {

});

router.get('/nudge/:userid', (req, res, next) => {

});

router.get('/close-shop', (req, res, next) => {

});

router.get('/open-shop', (req, res, next) => {

});

router.post('/sign-in', (req, res, next) => {
    let auth = passport.authenticate(
        'local',
        async (err, user ,info) => {
            if(err){
                res.sendStatus(500).json({'message': 'Passport authentication error'})
            }

            if(!user){
                res.sendStatus(404).json({'message': 'No user found'})
            }

            req.logIn(user, (err) => {
                if (err) {
                    res.sendStatus(500).json({'message': 'Express authentication error'})
                } else {
                    res.sendStatus(200).json({'message': 'Successful sign in'})
                }
            })
        }
    )
    auth(req, res, next);
});

router.post('/sign-up', async(req, res, next) => {
    const { username, email, password} = req.body;
    let newUser = await barbers.addUser(username,email,password);
    return res.sendStatus(newUser.statusCode).json({
        'message': newUser.message
    });
});

router.post('/sign-out', (req, res, next) => {
    req.logOut();
    res.redirect("/");
});

router.post('/info/update', async(req, res, next) => {
    const {
        barberId,
        email,
        address1,
        address2,
        postalCode,
        operatingHoursMondayStart,
        operatingHoursMondayEnd,
        operatingHoursTuesdayStart,
        operatingHoursTuesdayEnd,
        operatingHoursWednesdayStart,
        operatingHoursWednesdayEnd,
        operatingHoursThursdayStart,
        operatingHoursThursdayEnd,
        operatingHoursFridayStart,
        operatingHoursFridayEnd,
        operatingHoursSaturdayStart,
        operatingHoursSaturdayEnd,
        operatingHoursSundayStart,
        operatingHoursSundayEnd,
        operatingHoursWeekdaySame,
        operatingHoursWeekendSame,
        operatingHoursPublicHolidays
    } = req.body

    let operatingHours = {
        monday: operatingHoursMondayStart + operatingHoursMondayEnd,
        tuesday: operatingHoursTuesdayStart + operatingHoursTuesdayEnd,
        wednesday: operatingHoursWednesdayStart + operatingHoursWednesdayEnd,
        thursday: operatingHoursThursdayStart + operatingHoursThursdayEnd,
        friday: operatingHoursFridayStart + operatingHoursFridayEnd,
        saturday: operatingHoursSaturdayStart + operatingHoursSaturdayEnd,
        sunday: operatingHoursSundayStart + operatingHoursSundayEnd,
        weekday: operatingHoursWeekdaySame,
        weekend: operatingHoursWeekendSame,
        publicHoliday: operatingHoursPublicHolidays
    }

    let updatedUserInfo = await barbers.updateUserInfo(
        barberId, email, address1, address2, postalCode, operatingHours
    );
    return res.sendStatus(updatedUserInfo.statusCode).json({
        'message': updatedUserInfo.message
    });
});