'use strict';

const MusicApi = require('../index.js');

const musicApi = new MusicApi();

musicApi
    .search('color 3d')
    .then(result => {
        console.log(result.result.songs);
    }, console.error.bind(console));