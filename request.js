'use strict';

const http = require('http');
const https = require('https');
const parseUrl = require('url').parse;

module.exports = request;

function request(opts, callback) {
    opts = opts || {};
    const url = opts.url,
          method = opts.method && opts.method.toUpperCase() || 'GET',
          headers = opts.headers || {},
          form = opts.form || '';

    if(!url || typeof url !== 'string' || /^https?:\/\//.test(url))
        return callback(new Error('url is illegal, only supported http[s] protocol request!'));

    if(method !== 'GET' && method !== 'POST')
        return callback(new Error('only supported get or post method!'));

    const urlObj = parseUrl(url),
          protocol = urlObj.protocol,
          httpMethod = urlObj.protocol === 'https:' ? https : http;

    const options = {
        protocol: protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || (protocol === 'http' ? '80' : '443'),
        path: urlObj.path,
        method: method,
        headers: headers
    };

    const req = httpMethod.request(options, res => {

    });

    let chunks = [];
    req.on('data', data => {
        chunks.push(data);
    }).on('end', () => {
        const result = Buffer.concat(data).toString('utf8');
        
    }).on('error', err => callback(err));
}