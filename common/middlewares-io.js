const jwt = require('jsonwebtoken');

const config = require('@common/config');
const { User } = require('@common/models');


async function auth(socket, next) {
    try {
        const token = socket.request.cookies.token;
        const decoded = jwt.verify(token, config.secret);
        socket.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        console.log(err);
        socket.disconnect();
    }
}


module.exports = {
    auth
}