const { spawn } = require('child_process');

function run(file, input) {
    return new Promise((resolve, reject) => {
        var process = spawn('node', [file]);
        process.stdout.setEncoding('utf-8');
        process.stderr.setEncoding('utf-8');
        process.stdin.write(input);
        var stdout = '';
        var stderr = '';

        process.stdout.on('data', (data) => stdout += data.toString());
        process.stderr.on('data', (data) => stderr += data.toString());
        process.on('exit', (code) => resolve([stdout, stderr]));
        setTimeout(() => reject(new Error('Timeout')), 10000);
    });
}

module.exports = {
    language: 'javascript',
    run: run
}