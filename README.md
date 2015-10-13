# eclib - Bindings for liberasurecode

[![Circle CI][circle]](https://circleci.com/gh/scality/eclib)
[![npm version][npm version]](https://www.npmjs.com/package/eclib)

eclib is a set of NodeJS bindings for [liberasurecode][liberasure]
and its backends.

### Installation

```sh
# We rely on node-gyp to build our binaries
npm install -g node-gyp

# Install eclib
npm install eclib --save

# We link to the libraries we installed earlier
# On Linux
LD_LIBRARY_PATH=node_modules/eclib/libs/lib ./your_script
# On OSX
DYLD_LIBRARY_PATH=node_modules/eclib/libs/lib ./your_script
# You may export that environment variable for ease of use.
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

### Contribute
If you want to contribute in any way, please read our [guidelines](CONTRIBUTING.md).

[circle]: https://circleci.com/gh/scality/eclib.svg?&style=shield&circle-token=2f7b8c11e6dcb9327f1d5b09633fdf597ec955a2
[npm]: https://www.npmjs.com/package/eclib
[npm version]: https://img.shields.io/npm/v/eclib.svg
[liberasure]: https://bitbucket.org/tsg-/liberasurecode
