const mongo = require('../mongoUtil');
const ObjectId = require('mongodb').ObjectId;
const UserModel = require('./users')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser((id, done) => {
    let user = UserModel.getUserById(id);
    done(null, user);
})

passport.use(new LocalStrategy(
    {
        
    },
    async (username, password, done) => {
        let user = await UserModel.getUserByUsername(username)
        if (user && user.password == password) {
            done(null, user);
        }
        else {
            done(null, false, { message: 'Invalid Login' });
        }
    }
))

module.exports = passport
