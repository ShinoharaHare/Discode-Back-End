function func(io) {
    io.on('connection', (socket) => {
        //Code here
        socket.on('test', (data) => {
            socket.emit('test', {
                title: data.title,
            });
        });
    });
}

module.exports = func;