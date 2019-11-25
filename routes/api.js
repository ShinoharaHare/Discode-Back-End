const path = require('path');
const fs = require('fs');

const router = require('express').Router();

for (let file of fs.readdirSync(path.join(__dirname, 'api'))) {
    const obj = require(`./api/${file}`);
    router.use(`/${obj.path}`, obj.router);
}

module.exports = router;