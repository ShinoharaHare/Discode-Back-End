const { Channel } = require('@common/models');
const { publicChannelMembers } = require('@common/globals');

module.exports = (io) => {
    io.on('connection', async (socket) => {

        const channels = await Channel.find({
            $or: [
                { public: true },
                { 'members.id': socket.user.id }
            ]
        });

        for (let channel of channels) {
            if (channel.public) {
                publicChannelMembers[channel.id].add(socket.user.id);
            }
            socket.join(channel.id);
        }

        socket.on('disconnect', () => {
            for (let id in publicChannelMembers) {
                publicChannelMembers[id].delete(socket.user.id);
            }
        });

        socket.on('createChannel', async (data) => {
            try {

                const ch = await Channel.create({
                    name: data.name,
                    icon: data.icon,
                    public: data.public,
                    members: [{ id: socket.user.id }]
                });

                var channel = {
                    id: ch.id,
                    name: ch.name,
                    icon: ch.icon,
                    public: ch.public
                };

                if (ch.public) {
                    io.emit('newChannel', channel);
                } else {
                    socket.emit('newChannel', channel);
                }

            } catch (err) {
                console.log(err);
            }
        });

        socket.on('invite', async (data) => {
            try {

            } catch (err) {
                console.log(err);
            }
        });

    });
};