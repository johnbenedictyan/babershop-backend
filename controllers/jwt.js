var jwt = require('jsonwebtoken');

// TODO: Please change the secret token from plain text to an env var!
const secretToken = 'tOAl&Qe0%#PIflfYD5&ygHZsbf0ea#uuD0Wzb&*sTnWoPn$*';

function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, secretToken, (err, decoded) => {
        if (err) return res.sendStatus(403)
        req.meta = {
            customerId: decoded.customerId,
        }
    });
    next() // pass the execution off to whatever request the client intended
}

function signToken(params) {
    return jwt.sign(params, secretToken);
}

module.exports = {
    authenticateToken,
    signToken
}
