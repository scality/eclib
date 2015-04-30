# Setup guide for the Node-ECLib


### Install gf-complete
=======================

``` sh
  $ git clone git@lab.jerasure.org:jerasure/gf-complete.git
  $ cd gf-complete
  $ ./autogen.sh
  $ ./configure
  $ make
  $ sudo make install
```

-----

### Install jerasure
====================
	This is revision 2.0 of Jerasure. This is pretty much Jerasure 1.2 without the 
	original Galois Field backend. Version 2.0 links directly to GF-Complete, which is more flexible than the original, and *much* faster, because it leverages SIMD instructions.

``` sh
  $ git clone git@lab.jerasure.org:jerasure/jerasure.git
  $ cd jerasure
  $ autoreconf --force --install -I m4
  $ ./configure
  $ make
  $ sudo make install
```

------

### Install liberasurecode
=======================
	liberasurecode is an Erasure Code API library written in C with pluggable Erasure Code backends.

``` sh
 $ git clone https://*******@bitbucket.org/tsg-/liberasurecode.git
 $ cd liberasurecode
 $ ./autogen.sh
 $ ./configure
 $ make
 $ make test
 $ sudo make install
```




Requireed NPM's
===============
Install the following npms 

``` sh
 $ npm install nan
 $ sudo npm install node-gyp -g
 $ 
 $ 
 $ 
```


----