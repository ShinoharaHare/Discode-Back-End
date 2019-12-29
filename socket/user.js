const { userStatus } = require('@common/globals');

module.exports = (io) => {
    io.on('connection', (socket) => {
        userStatus[socket.user.id] = 'online';

        socket.broadcast.emit('changeStatus', {
            id: socket.user.id,
            status: userStatus[socket.user.id]
        });

        socket.on('disconnect', () => {
            delete userStatus[socket.user.id];
        });

        socket.on('changeStatus', (status) => {
            userStatus[socket.user.id] = status;

            io.emit('changeStatus', {
                id: socket.user.id,
                status: status
            });
        });
    });
};