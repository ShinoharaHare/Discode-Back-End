const jwt = require('jsonwebtoken');

const config = require('@common/config');

async function auth(req, res, next) {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.json({ success: false, msg: err.message });
            } else {
                req.decodedToken = decoded;
                next();
            }
        });
    } else {
        return res.status(403).json({
            success: false,
            msg: '未提供 Token'
        });
    }
}

module.exports = {
    auth
};