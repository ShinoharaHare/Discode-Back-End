const router = require('express').Router();

const error = require('@common/error');
const { auth } = require('@common/middlewares');
const { User, Channel, Message } = require('@common/models');
const { onlineUsers } = require('@common/globals');

router.use(auth);

router.get('/', async (req, res) => {
    try {
        const channelDocs = await Channel.find({
            $or: [
                { public: true },
                { 'members.id': req.user.id }
            ]
        });

        const channels = [];
        for (let channel of channelDocs) {
            const MessageDocs = await Message.find({ channel: channel.id }).limit(50);
            const messages = [];

            for (let message of MessageDocs) {
                messages.push({
                    id: message.id,
                    channel: message.channel,
                    author: message.author,
                    content: message.content,
                    attachments: message.attachments,
                    code: message.code
                });
            }

            channels.push({
                id: channel.id,
                name: channel.name,
                icon: channel.icon,
                messages: messages,
                members: channel.public ? Array.from(onlineUsers[channel.id]) : channel.members.map((m) => m.id)
            });
        }

        res.json({
            success: true,
            data: channels
        });

    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});

router.get('/:channel/members', async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.channel);
        const memberIds = channel.members.map((m) => m.id);
        const doc = await User.find({ '_id': { $in: memberIds } });

        var members = [];

        for (const member of doc) {
            members.push({
                username: member.username,
                nickname: member.nickname,
                avatar: member.avatar,
                message: member.message
            });
        }

        res.json({
            success: true,
            data: members
        });

    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});

router.get('/:channel/messages', async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 50;
        const data = await Message.find({ channel: req.params.channel }).limit(limit);
        var messages = [];

        for (let msg of data) {
            messages.push({
                id: msg.id,
                channel: msg.channel,
                author: msg.author,
                content: msg.content,
                attachments: msg.attachments,
                code: msg.code
            });
        }

        res.json({
            success: true,
            data: messages
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});

router.post('/create', async (req, res) => {
    try {
        const channel = await Channel.create({
            name: req.body.name,
            icon: req.body.icon,
            public: req.body.public
        });

        res.json({
            success: true,
            data: {
                id: channel.id,
                name: channel.name,
                channel: channel.icon,
                public: channel.public
            }
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});


router.post('/:channel/edit/:item', async (req, res) => {
    try {
        const doc = await Channel.findById(req.params.channel);
        
        switch (req.params.item) {
            case 'name':
                doc.name = req.body.name;
                break;
            case 'icon':
                doc.icon = req.body.icon;
                break;
        }
        
        const channel = await doc.save();

        res.json({
            success: true,
            data: {
                id: channel.id,
                name: channel.name,
                icon: channel.icon
            }
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});


module.exports = {
    path: 'channel',
    router: router
};