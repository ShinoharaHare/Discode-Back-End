// const { isMember } = require('@common/middlewares-io');
const { Channel } = require('@common/models');
const fileWriter = require('@common/file-writer');

function func(io) {
    io.on('connection', async (socket) => {
        const channels = await Channel.find({
            $or: [
                { public: true },
                { 'members.id': socket.user.id }
            ]
        });
        for (let channel of channels) {
            socket.join(channel.id);
        }
        socket.on('message', async (msg) => {
            var attachments = [];

            for (let file of msg.files) {
                const id = fileWriter.write(file, { channel: msg.channel })
                attachments.push({
                    id: id,
                    filename: file.name,
                    size: file.size,
                    type: file.type
                });
            }

            io.to(msg.channel).emit('message', {
                channel: msg.channel,
                author: {
                    id: socket.user.id,
                    name: socket.user.nickname || socket.user.username,
                    avatar: socket.user.avatar
                },
                content: msg.content,
                attachments: attachments
            });
        });

    });
}

module.exports = func;