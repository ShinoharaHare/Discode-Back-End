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
    }
});

router.get('/:channel/messages', async (req, res) => {
    try {
        const data = await Message.find({ channel: req.params.channel });
        res.json({
            success: true,
            data: [
                {
                    author: { name: '測試人員' },
                    content: `在ID為${req.params.channel}的頻道發話`
                }
            ]
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = {
    path: 'channel',
    router: router
};