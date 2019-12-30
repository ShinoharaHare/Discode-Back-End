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
                const doc = await Channel.create({
                    name: data.name,
                    icon: data.icon,
                    public: data.public,
                    members: data.public ? [] : [{ id: socket.user.id }]
                });

                var channel = {
                    id: doc.id,
                    name: doc.name,
                    icon: doc.icon,
                    public: doc.public,
                    members: doc.members
                };

                if (channel.public) {
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

                if (channelDoc.members.every((x) => x.id != user.id)) {
                    members.push({ id: user.id });
                    const channel = await channelDoc.save();

                    socket.emit('newChannel', {
                        id: channel.id,
                        name: channel.name,
                        icon: channel.icon,
                        public: channel.public,
                        members: channel.members
                    });

                    joinRoom(sockets[user.id], channel);
                }
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
            member: { id: socket.user.id }
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
                member: { id: socket.user.id }
            });
        }
    }
}