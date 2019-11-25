const jwt = require('jsonwebtoken');

const config = require('@common/config');
const router = require('express').Router();
const { User } = require('@common/models');

const expires = 60 * 60 * 24 * 30;

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            throw { msg: '找不到此用戶' };
        }

        if (user.hash != req.body.hash) {
            throw { msg: '密碼錯誤' };
        }

        const token = generateToken(user);
        res.status(200).cookie('token', token, { expires: new Date(Date.now() + 1000 * expires) }).json({
            success: true,
            msg: '登入成功',
            token: token
        });

    } catch (err) {
        console.log(err);
        res.status(401).json({
            success: false,
            msg: err.msg || '未知的錯誤'
        });
    }
});

router.post('/register', async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            hash: req.body.hash,
            email: req.body.email
        });

        const token = generateToken(user);
        res.status(200).cookie('token', token, { expires: new Date(Date.now() + 1000 * expires) }).json({
            success: true,
            msg: '註冊成功',
            token: token
        });

    } catch (err) {
        console.log(err);
        res.status(401).json({
            success: false,
            msg: '註冊失敗'
        });
    }
});


function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email
    };

    return jwt.sign(payload, config.secret, { expiresIn: expires });
}



module.exports = {
    path: 'member',
    router: router
};