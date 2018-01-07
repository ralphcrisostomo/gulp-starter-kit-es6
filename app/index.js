'use strict';

const through2 = require('through2');

module.exports = function (params, options) {
    return through2.obj(function (file, enc, cb) {
        return cb(null, file);
    });
};