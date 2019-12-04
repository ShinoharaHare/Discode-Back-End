const router = require('express').Router();

const { auth } = require('@common/middlewares');
const { Channel } = require('@common/models');

router.get('/', auth, async (req, res) => {
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

module.exports = {
    path: 'channel',
    router: router
};