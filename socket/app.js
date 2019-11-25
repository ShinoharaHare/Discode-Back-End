const io = require('socket.io')();

require('./test')(io);


module.exports = io;