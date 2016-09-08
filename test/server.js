'use strict';

const http = require('http');

const server = http.createServer((req, res) => {
    let chunks = [];

    req.on('data', data => chunks.push(data));
    req.on('end', () => {
        console.log(req.headers);
        console.log(Buffer.concat(chunks).toString('utf8'));
        res.end();
    });
});

server.listen(3000, () => console.log('server start on port 3000'));