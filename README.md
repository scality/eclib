# Node-eclib - Bindings for liberasurecode

[![Circle CI][circle]](https://circleci.com/gh/scality/eclib)
[![npm version][npm version]](https://www.npmjs.com/package/eclib)

eclib is a set of NodeJS bindings for [liberasurecode][liberasure]
and its backends.

### Installation

```sh
# We rely on node-gyp to build our binaries
npm install -g node-gyp
# Install node-eclib, you will need admin rights to install the libraries
npm install eclib --save
```

### How to use it
See the [API documentation](API.md).

### License
eclib is distributed under the terms of the [BSD license](LICENSE).

[circle]: https://img.shields.io/circleci/project/scality/eclib/master.svg
[npm]: https://www.npmjs.com/package/eclib
[npm version]: https://img.shields.io/npm/v/eclib.svg
[coveralls]: https://img.shields.io/coveralls/scality/eclib.svg
[liberasure]: https://bitbucket.org/tsg-/liberasurecode
