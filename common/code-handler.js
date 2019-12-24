const path = require('path');
const fs = require('fs');

const languages = {};

    const obj = require(path.resolve(`handler/code/${path_}`));
    languages[obj.language] = obj;
}

function run(language, file, input) {
    return languages[language].run(file, input);
}


module.exports = run;