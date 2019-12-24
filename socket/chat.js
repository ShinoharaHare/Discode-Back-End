const path = require('path');

const { Channel } = require('@common/models');
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
            var attachments = resolveAttachment(msg);
            var code = await resolveCode(msg);

            io.to(msg.channel).emit('message', {
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

function resolveAttachment(msg) {
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

    return attachments;
}


async function resolveCode(msg) {
    var code = {
        language: msg.code.language,
        content: msg.code.content,
        input: msg.code.input,
        stdout: '',
        stderr: ''
    };

    const id = fileWriter.write({ name: '', data: code.content }, { channel: msg.channel });
    
    var output = await runCode(code.language, path.resolve(`content/channel/${msg.channel}/${id}`), code.input);
    code.stdout = output[0];
    code.stderr = output[1];
    console.log(code);
    return code;
}

module.exports = func;