'use strict';

const MusicApi = require('../index.js');

const musicApi = new MusicApi();

// musicApi
//     .search('color 3d', 1)
//     .then(result => {
//         console.log(JSON.stringify(result, null, ' '));
//     }, console.error.bind(console));

musicApi
    .mp3Url('40915694')
    .then(result => {
        console.log(JSON.stringify(result, null, ' '));
    }, console.error.bind(console));

// musicApi
//     .mv('5360424')
//     .then(result => {
//         console.log(JSON.stringify(result, null, ' '));
//     }, console.error.bind(console));

// musicApi
//     .detali('34380473')
//     .then(result => {
//         console.log(JSON.stringify(result, null, ' '));
//     }, console.error.bind(console));

// musicApi
//     .lyric('399367218')
//     .then(result => {
//         console.log(JSON.stringify(result, null, ' '));
//     }, console.error.bind(console));

// musicApi
//     .playList('379372244')
//     .then(result => {
//         console.log(JSON.stringify(result, null, ' '));
//     }, console.error.bind(console));