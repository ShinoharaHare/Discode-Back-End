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

router.post('/upload', auth, async (req, res) => {
    try {
        var file = req.files.avatar;
        var id = fileWriter.write(file, { user: req.user.id });
        res.json({
            success: true,
            data: { id: id }
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});

router.post('/edit', auth, async (req, res) => {
    try {
        var user = await User.findByIdAndUpdate(req.user.id, req.body);
        res.json({
            success: true,
            data: Object.assign({
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                avatar: user.avatar
            }, req.body)
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err instanceof Error ? error.UnknownError : err
        });
    }
});

router.post('/edit/:item', auth, async (req, res) => {
    try {
        var user;
        switch (req.params.item) {
            case 'password':
                if (req.body.currentHash != req.user.hash) {
                    throw error.PasswordIncorrectError;
                }
                user = await User.findByIdAndUpdate(req.user.id, { hash: req.body.hash });
                break
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

module.exports = {
    path: 'user',
    router: router
};