'use strict';

/* http或https请求模块
 * @author: geemo<153330685@qq.com>
 * @version: 0.0.1
 * @create at: 2016-09-08
 * @license: MIT
 */

const http = require('http');
const https = require('https');
const parseUrl = require('url').parse;

exports = module.exports = request;

/* http请求方法
 * @param {Object} opts 选项参数，包含字段url, [method, headers, form]
 * @param {Function} callback 
 * @return {Undefined}
 */
function request(opts, callback) {
	opts = opts || {};
	const url = opts.url,
		  method = opts.method && opts.method.toUpperCase() || 'GET',
		  headers = opts.headers || {};

	let form = opts.form || '';

	if(!url || typeof url !== 'string' || !(/^https?:\/\//.test(url)))
		return callback(new Error('url is illegal, only supported http or https protocol!'));

	if(method !== 'GET' && method !== 'POST')
		return callback(new Error('only supported get or post method!'));

	const urlObj = parseUrl(url),
		  protocol = urlObj.protocol,
		  httpMethod = protocol === 'http:' ? http : https;

	const headerKeys = Object.keys(headers).map(key => key.toLowerCase());

	if(headerKeys.indexOf('referer') !== -1) headers['Referer'] = url;

	const options = {
		protocol: protocol,
		hostname: urlObj.hostname,
		port: urlObj.port || (protocol === 'http:' ? '80' : '443'),
		path: urlObj.path,
		method: method,
		headers: headers
	};

	const req = httpMethod.request(options, res => {
		let chunks = [];
		
		res.on('data', data => {
			chunks.push(data)
		}).on('end', () => {
			let result = Buffer.concat(chunks).toString('utf8');
			if(/json/.test(res.headers['content-type'])) {
				try {
					result = JSON.parse(result);
				} catch(e) {
					return callback(e);
				}
			}

			callback(null, {headers: res.headers, body: result});
		});
	});

	req.on('error', callback);

	form = typeof form === 'object' ? JSON.stringify(form) : form;
	if(headerKeys.indexOf('content-length') !== -1) headers['Content-Length'] = form.length;

	req.end(form);
}