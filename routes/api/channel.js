const router = require('express').Router();

const { auth } = require('@common/middlewares');
const { User, Channel, Message } = require('@common/models');

router.use(auth);

router.get('/', async (req, res) => {
    try {
        const data = await Channel.find({
            $or: [
                { public: true },
                { 'members.id': req.user.id }
            ]
        });
        const channels = [];
        for (let d of data) {
            channels.push({
                id: d.id,
                name: d.name,
                icon: d.icon,
                members: d.members
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
        const members = await User.find({ '_id': { $in: memberIds } });

        var obj = {
            success: true,
            data: []
        };

        for (const member of members) {
            obj.data.push({
                username: member.username,
                nickname: member.nickname,
                avatar: member.avatar
            });
        }
        
        res.json(obj);

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
                author: await getAuthorInfo(msg.author),
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

async function getAuthorInfo(id) {
    this.cahched = this.cahched || {};
    try {
        const user = this.cahched[id] || await User.findById(id);
        return {
            id: user.id,
            name: user.nickname || user.username,
            avatar: user.avatar
        };
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    path: 'channel',
    router: router
};