TARGET		= build/Release/node-eclib.node
GF			= gf_complete
JERA		= Jerasure
ISAL		= isal
ERASURE		= erasurecode
LIB_EXT		:= so
ifeq ($(shell uname -s), Darwin)
	LIB_EXT := dylib
endif
ECLIB		= $(dir $(abspath $(MAKEFILE_LIST)))
LIBDIR		= $(ECLIB)libs
GFPATH		= $(ECLIB)gf_complete
JERAPATH	= $(ECLIB)Jerasure
ISALPATH	= $(ECLIB)isa-l
ERASUREPATH	= $(ECLIB)erasurecode
GFLIB		= $(LIBDIR)/lib/lib$(GF).$(LIB_EXT)
JERALIB		= $(LIBDIR)/lib/lib$(JERA).$(LIB_EXT)
ISALLIB		= $(LIBDIR)/lib/lib$(ISAL).$(LIB_EXT)
ERASURELIB	= $(LIBDIR)/lib/lib$(ERASURE).$(LIB_EXT)

all: $(TARGET)

$(TARGET): | $(LIBDIR) $(ISALLIB) $(GFLIB) $(JERALIB)  $(ERASURELIB)

$(LIBDIR):
	mkdir $(LIBDIR)

$(ISALPATH):
	git clone https://github.com/01org/isa-l.git $@

$(ISALPATH)/Makefile: | $(ISALPATH)
	cd $(ISALPATH) && ./autogen.sh --prefix=$(LIBDIR) \
		LDFLAGS=-L$(LIBDIR)/lib \
		&& ./configure --prefix=$(LIBDIR) \
		LDFLAGS=-L$(LIBDIR)/lib \
		CPPFLAGS=-I$(LIBDIR)/include

$(ISALLIB): | $(ISALPATH)/Makefile
	$(MAKE) -C $(ISALPATH) && $(MAKE) -C $(ISALPATH) install

$(GFPATH):
	git clone http://lab.jerasure.org/jerasure/gf-complete.git $@

$(GFPATH)/Makefile: | $(GFPATH)
	cd $(GFPATH) && ./autogen.sh && ./configure --prefix=$(LIBDIR)

$(GFLIB): | $(GFPATH)/Makefile
	$(MAKE) -C $(GFPATH) && $(MAKE) -C $(GFPATH) install

$(JERAPATH):
	git clone http://lab.jerasure.org/jerasure/jerasure.git $@

$(JERAPATH)/Makefile: | $(JERAPATH)
	cd $(JERAPATH) && autoreconf --force --install \
		&& ./configure --prefix=$(LIBDIR) \
		LDFLAGS=-L$(LIBDIR)/lib \
		CPPFLAGS=-I$(LIBDIR)/include

$(JERALIB): | $(JERAPATH)/Makefile
	$(MAKE) -C $(JERAPATH) && $(MAKE) -C $(JERAPATH) install


$(ERASUREPATH):
	git clone https://github.com/openstack/liberasurecode.git $@

$(ERASUREPATH)/Makefile: | $(ERASUREPATH)
	cd $(ERASUREPATH) && ./autogen.sh && ./configure --prefix=$(LIBDIR)

$(ERASURELIB): | $(ERASUREPATH)/Makefile
	$(MAKE) -C $(ERASUREPATH) && $(MAKE) -C $(ERASUREPATH) install

clean:
	$(RM) $(TARGET)

distclean: clean
	$(RM) -r $(ISALPATH) $(GFPATH) $(JERAPATH) $(ERASUREPATH)

re: distclean all

.PHONY: all clean distclean re
