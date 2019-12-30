const { User, Channel } = require('@common/models');
const { onlineUsers, sockets } = require('@common/globals');

module.exports = (io) => {
    io.on('connection', async (socket) => {

        const channels = await Channel.find({
            $or: [
                { public: true },
                { 'members.id': socket.user.id }
            ]
        });

        for (let channel of channels) {
            joinRoom(socket, channel);
        }

        socket.on('disconnect', async () => {
            for (let id in onlineUsers) {
                const channel = await Channel.findById(id);
                leaveRoom(socket, channel);
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
                const channelDoc = await Channel.findById(data.channel);
                const user = await User.findOne({ username: data.username });

                channelDoc.members.push({ id: user.id });

                const channel = await channelDoc.save();

                socket.emit('newChannel', {
                    id: channel.id,
                    name: channel.name,
                    icon: channel.icon,
                    public: channel.public
                });

                joinRoom(sockets[user.id], channel);

            } catch (err) {
                console.log(err);
            }
        });

    });
};


function joinRoom(socket, channel) {
    if (socket) {
        onlineUsers[channel.id].add(socket.user.id);
        socket.join(channel.id);
        socket.broadcast.emit('newMember', {
            channel: channel.id,
            user: socket.user.id
        });
    }
}

function leaveRoom(socket, channel) {
    if (socket) {
        onlineUsers[channel.id].delete(socket.user.id);
        socket.leave(channel.id);
        if (channel.public) {
            socket.io.emit('removeMember', {
                channel: channel.id,
                user: socket.user.id
            });
        } else {
            sock
        }
    }
}