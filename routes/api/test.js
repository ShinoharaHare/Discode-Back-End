const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('test');
});

module.exports = {
    path: 'test',
    router: router
};