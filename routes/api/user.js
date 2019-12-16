const router = require('express').Router();
const { auth } = require('@common/middlewares');
const { User } = require('@common/models');
const error = require('@common/error');
const fileWriter = require('@common/file-writer');

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
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = User.findById(req.params.id);
        if (!user) {
            throw error.UserNotFoundError;
        }
        res.json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                avatar: user.avatar
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

router.post('/upload/:item', auth, async (req, res) => {
    try {
        switch (req.params.item) {
            case 'avatar':
                var file = req.files.avatar;
                var id = fileWriter.write(file, { user: req.user.id });
                res.json({
                    success: true,
                    data: {
                        id: id
                    }
                });
                break;
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/edit', auth, async (req, res) => {
    try {
        if (req.body.hash != req.user.hash) {
            throw error.PasswordIncorrectError;
        }
        const user = await User.findByIdAndUpdate(req.user.id, {
            username: req.body.username,
            nickname: req.body.nickname,
            avatar: req.body.avatar
        });

        res.json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                avatar: user.avatar
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
    path: 'user',
    router: router
};