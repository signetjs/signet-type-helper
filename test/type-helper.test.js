'use strict';

const assert = require('chai').assert;
const typeHelperFactory = require('../index.js');

describe('Signet Type Helper', function () {

    let signet;

    beforeEach(function () {
        signet = typeHelperFactory();
        signet.attachGlobals();
    });

    describe('constructSignature', function () {

        it('should assemble a simple signature correctly', function () {
            let signature = constructSignature([
                { types: [types.number, types.string] },
                { types: [types.string] }
            ]);

            assert.equal(signature, 'number, string => string');
        });

        it('should construct a full signature properly', function () {
            let signature = constructSignature([
                {
                    dependent: ['start < end'],
                    types: [
                        typeConstructors.number([], { name: 'start' }),
                        typeConstructors.number([], { name: 'end' }),
                        typeConstructors.leftBounded([1], { name: 'increment', optional: true })
                    ]
                },
                {
                    types: [typeConstructors.array([types.number], { name: 'range' })]
                }
            ]);

            assert.equal(signature, 'start < end :: start:number, end:number, increment:[leftBounded<1>] => range:array<number>');
        });

    });

    describe('extendWithType', function () {
        
        it('should add a type to signet.types', function () {
            signet.extendWithType('foo', (value) => value === 'bar');
            signet.extendWithType.signature;
            assert.equal(signet.types.foo, 'foo');
        });

        it('should add a type to signet.types.constructors', function () {
            signet.extendWithType('foo', (value) => value === 'bar');
            assert.equal(signet.typeConstructors.foo(), 'foo');
        });

    });

});

if (typeof global.runQuokkaMochaBdd === 'function') {
    runQuokkaMochaBdd();
}