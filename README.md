# Signet Type Helper #

Signet is a powerful documentation and type library for Javascript; this helper is to facilitate integrating types into the imported module.  By adding type information into in-memory data structures, autocomplete is able to find and expose these types, adding power and a better experience into your editor.

## Extensions on Type Definition ##

Extend, subtypeOf and alias are all extended with new endpoints, which integrate type names into the types and typeConstructors objects exposed off the base Signet API. These new API endpoints follow identical signatures to their core Signet counterparts and are defined as follows:

- extendWithType -- `typeName:string, typePredicate:(* => boolean) => undefined`
- extendWithTypeConstructor -- `typeName:string, typePredicate:(* => boolean) => undefined`
- subtypeWithType -- `parentTypeName:string => typeName:string, typePredicate:(* => boolean) => undefined`
- subtypeWithTypeConstructor -- `parentTypeName:string => typeName:string, typePredicate:(* => boolean) => undefined`
- aliasWithType -- `typeName:string, typeString:string => undefined`
- aliasWithTypeConstructor -- `typeName:string, typeString:string => undefined`

All of these functions will add a key to the typeConstructors object, but any of the methods named "withTypeConstructor" will assign a key ONLY to the typeConstructors object. This can be exemplified as follows:

```
var signet = require('signet-type-helper')();

signet.extendWithType('foo', (value) => value === 'bar');

console.log(signet.types.foo); // foo
console.log(signet.typeConstructors.foo([], { name: 'testing', optional: true })); // testing:[foo]
```