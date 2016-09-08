'use strict';

const request = require('../utils/request.js');

request({
	url: 'https://www.baidu.com?aadf=ccc',
	method: 'get'
}, (err, res, data) => {
	if(err) return console.log(err);

	console.dir(res);
});