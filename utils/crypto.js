'use strict';

/* 网易云音乐数据加密模块, 参考了https://github.com/axhello/NeteaseCloudMusicApi
 * @author: geemo<153330685@qq.com>
 * @version: 0.0.1
 * @create at: 2016-09-07
 * @license: MIT
 */

const crypto = require('crypto');
const bigInt = require('big-integer');

exports.encryptData = encryptData;

// 模数字符串
const _MODULUS = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
// 随机字符串
const _NONCE = '0CoJUm6Qyw8W8jud';
// 公钥
const _PUBKEY = '010001';

/* 加密请求数据, 返回带加密参数的json对象 公有
 * @param {String} data 待加密文本
 * @return {Object}
 */
function encryptData(data) {
	const secKey = _createSecKey(16);
	return {
		params: _aesEncrypt(_aesEncrypt(data, _NONCE), secKey),
		encSecKey: _rsaEncrypt(data, _PUBKEY, _MODULUS)
	};
}

/* 往字符串左边或右边追加指定字符 私有
 * @param {String} encTxt 待追加字符的文本 
 * @param {Number} len 追加字符后的总文本长度
 * @param {String} char 追加的字符串
 * @param {Boolean|Undefined} padLeft 是否追加在左边
 * @return {String}
 */
function _strPad(encTxt, len, char, padLeft) {
	const charLen = len - encTxt.length;
	if(charLen <= 0) return encTxt;

	char = char || '0';
	const repeatNum = Math.floor(charLen / char.length);
	const tailChar = char.slice(0, len - charLen * repeatNum);
	const padStr = char.repeat(repeatNum) + tailChar;

	if(padLeft) 
		return padStr + encTxt;
	else
		return encTxt + padStr;
}

/* 返回aes加密后的结果 私有
 * @param {String} data 待加密文本
 * @param {String} secKey 加密秘钥
 * @return {String}
 */
function _aesEncrypt(data, secKey) {
	const cipher = crypto.createCipheriv('AES-128-CBC', secKey, '0102030405060708');
	return cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
}

/* 返回rsa加密后的结果 私有
 * @param {String} data 待加密文本
 * @param {String} pubEx 公钥指数
 * @param {String} 模数
 * @return {String}
 */
function _rsaEncrypt(data, pubEx, mod) {
	const base = 16;
	const rData = data.split('').reverse().join('');
	const biData = bigInt(new Buffer(rData).toString('hex'), base),
		  biEx = bigInt(pubEx, base),
		  biMod = bigInt(mod, base),
		  biRet = biData.modPow(biEx, biMod);

	return _strPad(biRet.toString(base), 256, '0', true);
}

/* 创建秘钥 私有
 * @param {Number} len 秘钥长度
 * @return {String}
 */
function _createSecKey(len) {
	const randStr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const randStrLen = randStr.length;
	let secKey = '';

	for(let i = 0; i < len; ++i) {
		secKey += randStr[Math.floor(Math.random() * randStrLen)];
	}

	return secKey;
}