# eclib - Bindings for liberasurecode

[![Circle CI][circle]](https://circleci.com/gh/scality/eclib)
[![npm version][npm version]](https://www.npmjs.com/package/eclib)

eclib is a set of NodeJS bindings for [liberasurecode][liberasure]
and its backends.

### Installation

```sh
# We rely on node-gyp to build our binaries
npm install -g node-gyp
# Install eclib, you will need admin rights to install the libraries
npm install eclib --save
```
That's all!

### Usage
```node
// ES5
var eclib = require('eclib');

var Eclib = new eclib(opts);
Eclib.init();
```
See the [API documentation](API.md) for a more detailed explanation.

### License
eclib is distributed under the terms of the [BSD license](LICENSE).

[circle]: https://circleci.com/gh/scality/eclib.svg?&style=shield
[npm]: https://www.npmjs.com/package/eclib
[npm version]: https://img.shields.io/npm/v/eclib.svg
[liberasure]: https://bitbucket.org/tsg-/liberasurecode
