'use strict';

const encryptData = require('./utils/crypto.js').encryptData;
const request = require('./utils/request.js');

class MusicApi {
	constructor() {}

	search(s, limit, offset, type) {
		limit = limit || 30;
		offset = offset || 0;
		type = type || 1;

		const url = 'http://music.163.com/weapi/cloudsearch/get/web?csrf_token=';
		const data = {
			s: s,
			type: type,
			limit: limit,
			total: true,
			offset: offset,
			csrf_token: ''
		};

		return this
				._request(url, data, 'json')
				.then(resData => {
					
				}, err => Promise.reject(err));
	}

	detali(songIds) {
		const url = 'http://music.163.com/weapi/v1/song/detail';
		const data = {
			ids: Array.isArray(songIds) ? songIds : [songIds],
			csrf_token: ''
		};

		return this._request(url, data);
	}

	mp3Url(songIds, br) {
		br = br || 320000;

		const url = 'http://music.163.com/weapi/song/enhance/player/url?csrf_token=';
		const data = {
			ids: Array.isArray(songIds) ? songIds : [songIds],
			br: br,
			csrf_token: ''
		};

		return this._request(url, data);
	}

	lyric(songId) {
		const url = 'http://music.163.com/weapi/song/lyric?csrf_token=';
		const data = {
			id: songId,
			os: 'pc',
			lv: '-1',
			kv: '-1',
			tv: '-1',
			csrf_token: ''
		};

		return this._request(url, data);
	}

	playList(playListId) {
		const url = 'http://music.163.com/weapi/v3/playlist/detail?csrf_token=';
		const data = {
			id: playListId,
			n: '1000',
			csrf_token: ''
		};

		return this._request(url, data);
	}

	mv(mvId) {
		const url = 'http://music.163.com/weapi/mv/detail/';
		const data = {
			id: mvId,
			csrf_token: ''
		};

		return this._request(url, data);
	}

	_request(url, data, dataType) {
		dataType = dataType || 'text';

		return new Promise((resolve, reject) => {
			const referer = 'http://music.163.com/';
			data = typeof data === 'object' ? JSON.stringify(data) : data;
			request({
				url: url,
				headers: { Referer: referer, Host: 'music.163.com' },
				method: 'POST',
				form: encryptData(data)
			}, (err, res, result) => {
				if(err) return reject(err);
				if(dataType === 'json') {
					try {
						result = JSON.parse(result);
					} catch(e) {
						return reject(e);
					}

					return resolve(result);
				}

				resolve(result);
			});
		});
	}
}

exports = module.exports = MusicApi;