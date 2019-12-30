const cookieParser = require('socket.io-cookie-parser');
const io = require('socket.io')();

const { auth } = require('@common/middlewares-io');

io.use(cookieParser());
io.use(auth);
io.use((socket, next) => {
    socket.io = io;
    next();
});

require('./user')(io);
require('./message')(io);
require('./channel')(io);

module.exports = io;