module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('changeStatus', (status) => {
            io.emit('changeStatus', {
                id: socket.user.id,
                status: status
            });
        });
    });
};