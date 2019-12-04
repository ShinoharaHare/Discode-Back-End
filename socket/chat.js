module.exports = (io) => {
    io.on('connection', (socket) => {
        // Code here
        socket.on('newMessage', async (msg) => {
            
        })

    });
}
