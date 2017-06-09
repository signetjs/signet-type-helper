var signetTypeHelper = (function () {
    'use strict';
    function typeHelper() {
        var _signet;
        var _signetAssembler;


        if (typeof require === 'function') {
            _signet = require('signet')();
            _signetAssembler = require('signet-assembler');
        } else {
            _signet = signet;
            _signetAssembler = signetAssembler;
        }

        _signet.types = {};
        _signet.typeConstructors = {};

        function getType(typeName) {
            return function () {
                return typeName;
            };
        }

        function getTypeConstructor(typeName) {
            return function (subtypeArray, options) {
                var cleanOptions = typeof options === 'object' ? options : {};

                var typeDef = {
                    name: cleanOptions.name,
                    type: typeName,
                    subtype: subtypeArray,
                    optional: Boolean(cleanOptions.optional)
                }

                return _signetAssembler.assembleType(typeDef);
            };
        }

        function constructSignaturePart(signaturePartDef) {
            var dependentData = typeof signaturePartDef.dependent !== 'undefined' ?
                signaturePartDef.dependent :
                null;

            var signature = dependentData !== null ? dependentData.join(', ') + ' :: ' : '';

            return signature + signaturePartDef.types.join(', ');
        }

        function constructSignature(signatureDef) {
            return signatureDef.map(constructSignaturePart).join(' => ');
        }

        function attachGetterTo(obj) {
            return function (typeName, getter) {
                Object.defineProperty(obj, typeName, {
                    get: getter
                });
            };
        }

        var attachType = (function () {
            var attachType = attachGetterTo(_signet.types);

            return function (typeName) {
                attachType(typeName, getType(typeName));
            };
        })();

        var attachTypeConstructor = (function () {
            var attachTypeConstructor = attachGetterTo(_signet.typeConstructors);

            return function (typeName) {
                attachTypeConstructor(typeName, function () { return getTypeConstructor(typeName); });
            };
        })();

        function attachTypeAndConstructor(typeName) {
            attachTypeConstructor(typeName);
            attachType(typeName);
        }

        function extendWithType(typeName, predicate) {
            extendWithTypeConstructor(typeName, predicate);
            attachType(typeName);
        }

        function extendWithTypeConstructor(typeName, predicate) {
            _signet.extend(typeName, predicate);
            attachTypeConstructor(typeName);
        }

        function aliasWithType(typeName, typeStr) {
            aliasWithTypeConstructor(typeName, typeStr);
            attachType(typeName);
        }

        function aliasWithTypeConstructor(typeName, typeStr) {
            _signet.alias(typeName, typeStr);
            attachTypeConstructor(typeName);
        }

        function subtypeWithType(parentType) {
            return function (typeName, predicate) {
                subtypeWithTypeConstructor(parentType)(typeName, predicate);
                attachType(typeName);
            }
        }

        function subtypeWithTypeConstructor(parentType) {
            return function (typeName, predicate) {
                _signet.subtypeOf(parentType)(typeName, predicate);
                attachTypeConstructor(typeName);
            }
        }

        function attachNodeGlobals() {
            global.types = _signet.types;
            global.typeConstructors = _signet.typeConstructors;
            global.constructSignature = _signet.constructSignature;
            global.enforce = _signet.enforce;
            global.isTypeOf = _signet.isTypeOf;
        }

        function attachWindowGlobals() {
            window.types = _signet.types;
            window.typeConstructors = _signet.typeConstructors;
            window.constructSignature = _signet.constructSignature;
            window.enforce = _signet.enforce;
            window.isTypeOf = _signet.isTypeOf;
        }

        function attachGlobals() {
            var attachMethod = typeof global !== 'undefined' ? attachNodeGlobals : attachWindowGlobals;
            attachMethod();
        }

        [
            'any',
            'arguments',
            'array',
            'boolean',
            'function',
            'int',
            'null',
            'number',
            'object',
            'regexp',
            'string',
            'symbol',
            'type',
            'typeValue',
            'undefined',
            'void'
        ].forEach(attachTypeAndConstructor);

        [
            'bounded',
            'boundedInt',
            'boundedString',
            'composite',
            'formattedString',
            'leftBounded',
            'leftBoundedInt',
            'not',
            'rightBounded',
            'rightBoundedInt',
            'taggedUnion',
            'tuple',
            'unorderedProduct',
            'variant'
        ].forEach(attachTypeConstructor);

        _signet.attachGlobals = _signet.enforce('* => undefined', attachGlobals);
        _signet.constructSignature = _signet.enforce('signatureTree:array<object> => string', constructSignature);

        var extendSignature = 'typeName:string, typePredicate:(* => boolean) => undefined';

        _signet.extendWithType = _signet.enforce(extendSignature, extendWithType);
        _signet.extendWithTypeConstructor = _signet.enforce(extendSignature, extendWithTypeConstructor);

        var aliasSignature = 'typeName:string, typeString:string => undefined';

        _signet.aliasWithType = _signet.enforce(aliasSignature, aliasWithType);
        _signet.aliasWithTypeConstructor = _signet.enforce(aliasSignature, aliasWithTypeConstructor);

        var subtypeSignature = 'parentTypeName:string => typeName:string, typePredicate:(* => boolean) => undefined';

        _signet.subtypeWithType = _signet.enforce(subtypeSignature, subtypeWithType);
        _signet.subtypeWithTypeConstructor = _signet.enforce(subtypeSignature, subtypeWithTypeConstructor);

        return _signet;
    }

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = typeHelper;
    } else {
        return typeHelper;
    }
})();