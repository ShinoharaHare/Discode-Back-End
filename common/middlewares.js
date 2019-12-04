const jwt = require('jsonwebtoken');

const { User } = require('@common/models');

const config = require('@common/config');
const error = require('@common/error');

async function auth(req, res, next) {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, config.secret);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        var obj = {
            success: false,
        }
        console.log(err);
        res = res.status(403);
        switch (err.message) {
            case 'jwt must be provided':
                obj.error = error.TokenNotProvidedError;
                break;
            case 'invalid token':
            case 'Cast to ObjectId failed for value "111" at path "_id" for model "User"':
                obj.error = error.TokenNotValidError;
                break;
            case 'jwt expired':
                obj.error = error.TokenExpiredError;
                break;
        }

        res.json(obj);
    }
}

module.exports = {
    auth
};