'use strict';

/* 网易云音乐常用api封装
 * @author: geemo<153330685@qq.com>
 * @version: 1.0.0
 * @create at: 2016-09-09
 * @license: MIT
 */

const encryptData = require('./utils/crypto.js').encryptData;
const request = require('./utils/request.js');

class MusicApi {
	constructor() {}

	/* 通过关键字搜索音乐信息
	 * @param {String} keyword 曲名，专辑名或歌手名等
	 * @param {Number} limit 返回的歌曲条数，默认10条
	 * @param {Number} offset 跳过的歌曲条数, 主要是为了分页
	 * @param {Number} type
	 * @return {Promise}
	 */
	search(keyword, limit, offset, type) {
		limit = limit || 10;
		offset = offset || 0;
		type = type || 1;

		const url = 'http://music.163.com/weapi/cloudsearch/get/web?csrf_token=';
		const data = {
			s: keyword,
			type: type,
			limit: limit,
			total: true,
			offset: offset,
			csrf_token: ''
		};

		return this._request(url, data, 'json')
			.then(resData => {
				if (resData.code === 200) {
					resData.result.songs = resData.result.songs.map(song => {
						return {
							name: song.name,
							id: song.id,
							authors: song.ar,
							album: {
								id: song.al.id,
								name: song.al.name,
								picUrl: song.al.picUrl
							},
							duration: song.dt,
							mv: song.mv
						};
					});
				}

				return resData;
			}, err => err);
	}

	/* 通过id搜索歌曲详细信息
	 * @param {String|Array} songIds 歌曲id
	 * @return {Promise}
	 */
	detali(songIds) {
		const url = 'http://music.163.com/weapi/v1/song/detail';
		const data = {
			ids: Array.isArray(songIds) ? songIds : [songIds],
			csrf_token: ''
		};

		return this._request(url, data, 'json')
			.then(resData => {
				if (resData.code === 200) {
					resData.songs = resData.songs.map(song => {
						return {
							name: song.name,
							id: song.id,
							authors: song.ar,
							album: {
								id: song.al.id,
								name: song.al.name,
								picUrl: song.al.picUrl
							},
							duration: song.dt,
							mv: song.mv
						};
					});
				}

				return resData;
			}, err => err);
	}

	/* 批量搜索歌曲url
	 * @param {String|Array} songIds 歌曲id
	 * @return {Promise}
	 */ 
	mp3Url(songIds) {
		const url = 'http://music.163.com/weapi/song/enhance/player/url?csrf_token=';
		const data = {
			ids: Array.isArray(songIds) ? songIds : [songIds],
			br: 320000,
			csrf_token: ''
		};

		return this._request(url, data, 'json')
			.then(resData => {
				if (resData.code === 200) {
					resData.data = resData.data.map(d => {
						return {
							id: d.id,
							url: d.url
						};
					});
				}

				return resData;
			}, err => err);
	}

	/* 根据id过去歌词，包括原文歌词和翻译成中文的歌词
	 * @param {String} songId 歌曲id
	 * @return {Promise}
	 */ 
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

		return this._request(url, data, 'json')
			.then(resData => {
				if(resData.code === 200 && !resData.nolyric) {
					return {
						lyric: resData.lrc.lyric,
						tlyric: resData.tlyric.lyric,
						code: resData.code
					};
				}

				return resData;
			}, err => err);
	}

	/* 通过id获取mv
	 * @param {String} mvId
	 * @return {Promise}
	 */ 
	mv(mvId) {
		const url = 'http://music.163.com/weapi/mv/detail/';
		const data = {
			id: mvId,
			csrf_token: ''
		};

		return this._request(url, data, 'json')
			.then(resData => {
				if(resData.code === 200) {
					return {
						coverUrl: resData.data.cover,
						duration: resData.data.duration,
						brs: resData.data.brs,
						code: resData.code
					};
				}

				return resData;
			}, err => err);
	}

	/* 获取歌单信息
	 * @param {String} playListId 歌单id
	 * @return {Promise}
	 */ 
	playList(playListId) {
		const url = 'http://music.163.com/weapi/v3/playlist/detail?csrf_token=';
		const data = {
			id: playListId,
			n: '1000',
			csrf_token: ''
		};

		return this._request(url, data, 'json');
	}

	/* 发送http请求
	 * @param {String} url 请求的目的url
	 * @param {String|Object} data 发送的数据,可以为字符串或json对象
	 * @param {String} dataType 对响应数据进行何种格式(json|plain text)的数据解析
	 * @return {Promise}
	 */ 
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
				if (err) return reject(err);
				if (dataType === 'json') {
					try {
						result = JSON.parse(result);
					} catch (e) {
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