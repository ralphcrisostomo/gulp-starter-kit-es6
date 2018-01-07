'use strict';

const index = require('../../app/index');

describe('index.coffee', function () {
    it('should return callback', function () {
        const params  = {};
        const options = {};
        expect(index(params,options)).to.be.an('object')
    });
});