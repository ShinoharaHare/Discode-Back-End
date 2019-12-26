const { Channel, Message, User } = require('@common/models');
const fileWriter = require('@common/file-writer');
const runCode = require('@common//code-handler');

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
            var attachments, code;
            switch (msg.type) {
                case 'attachment':
                    attachments = resolveAttachments(msg);
                    break;
                case 'code':
                    code = await resolveCode(msg);
                    break;
            }

            const message = await Message.create({
                author: socket.user.id,
                channel: msg.channel,
                content: msg.content,
                attachments: attachments,
                code: code
            });

            io.to(msg.channel).emit('message', {
                id: message.id,
                channel: msg.channel,
                author: {
                    id: socket.user.id,
                    name: socket.user.nickname || socket.user.username,
                    avatar: socket.user.avatar
                },
                content: msg.content,
                attachments: attachments,
                code: code
            });
        });

    });
}

function resolveAttachments(msg) {
    var attachments = [];
    for (let file of msg.files) {
        const id = fileWriter.write(file, { channel: msg.channel })
        attachments.push({
            id: id,
            filename: file.filename,
            filetype: file.filetype,
            size: file.size
        });
    }

    return attachments;
}


async function resolveCode(msg) {
    var code = {
        language: msg.code.language,
        content: msg.code.content,
        stdin: msg.code.stdin,
        stdout: '',
        stderr: ''
    };

    var result = await runCode(code.language, code.content, code.stdin);

    code.stdout = result.stdout;
    code.stderr = result.stderr;

    return code;
}

module.exports = func;