const router = require('express').Router();
const { auth } = require('@common/middlewares');

router.get('/', auth, (req, res) => {
    try {
        res.json({ 
            success: true,
            data: {
                id: req.user.id,
                username: req.user.username,
                nickname: req.user.nickname,
                avatar: req.user.avatar
            }
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
        });
    }
});

module.exports = {
    path: 'user',
    router: router
};