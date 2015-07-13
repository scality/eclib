# Node-ECLib
===================
This is the node port of required library
https://bitbucket.org/tsg-/liberasurecode

Here is the main library Website,
http://jerasure.org

Here is the python wrapper of liberasurecode library
https://bitbucket.org/kmgreen2/pyeclib

To understand how the liberasurecode methods works, please go through this
class,
https://bitbucket.org/tsg-/liberasurecode/src/e46c434e36566f6f0820923a9a184e27d7b941e8/test/liberasurecode_test.c?at=master

------------

### Setup
=========
A simple command will take care of everything for you:
```sh
npm install
```
The install process will need to install libraries and node-gyp, requiring
sudo usage.


### Prestudy
===========
If you developed addons before, then you probably knew it. If not, it would
be really helpful to read this:
[nan-documentation](https://github.com/iojs/nan)


### Project structure
============
Here are the details

## Js Files
* eclib-enum.js # 
	This file will contain all the enum values that was introduced in the c project to keep the simillarity among the projects.
* eclib-util.js # 
	This contain all the util method that was required by the node-eclib.js file
* node-eclib.js #
	This file has some commented out code, please go through it. Initially it was a strait forward implementation. Currently the class has only the skeleton of the methods.

## Cpp files
* node-eclib.cpp # This file expose all the methods to JS interface
* asyncdecode.cpp # This class holds all the decode methods.(Previous plan was to use NAN's asyn task for decoding)
* asyncencode.cpp # This class holds all the encode methods. Partially implemented .(Previous plan was to use NAN's asyn task for encoding)
* asyncreconstruction.cpp # Just a dummy class for exposing fragment reconstruction
* libmain.cpp # This class will have all the method except those 5 methods. Partially implemented.
* Libutil.cpp # This class holds the util method for the all the classes. Just few methods are implemented here.

---------
