TARGET		= build/Release/node-eclib.node
GF			= gf_complete
JERASURE	= Jerasure
LIBERAS		= erasurecode

LIBDIR		= /usr/local/lib
LIBS		= $(addsuffix .so, $(GF) $(JERASURE) $(LIBERAS))
DEPS		= $(addprefix $(LIBDIR)/lib, $(LIBS))

LIB_EXT := so
ifeq ($(shell uname -s), Darwin)
	LIB_EXT := dylib
endif
LIB_GUARD := find /usr 2>/dev/null -name '*.$(LIB_EXT)' | grep

all: $(DEPS)

$(GF):
	$(LIB_GUARD) libgf_complete.$(LIB_EXT) || git clone http://lab.jerasure.org/jerasure/gf-complete.git $@

$(GF)/Makefile: | $(GF)
	$(LIB_GUARD) libgf_complete.$(LIB_EXT) || ( cd $(GF) && ./autogen.sh && ./configure )

$(LIBDIR)/libgf_complete.so: $(GF)/Makefile
	$(LIB_GUARD) libgf_complete.$(LIB_EXT) || ( $(MAKE) -C $(GF) && sudo $(MAKE) -C $(GF) install )

$(JERASURE):
	$(LIB_GUARD) libJerasure.$(LIB_EXT) || git clone http://lab.jerasure.org/jerasure/jerasure.git $@

$(JERASURE)/Makefile: | $(JERASURE)
	$(LIB_GUARD) libJerasure.$(LIB_EXT) || ( cd $(JERASURE) && autoreconf --force --install -I m4 && ./configure )

$(LIBDIR)/libJerasure.so: $(JERASURE)/Makefile
	$(LIB_GUARD) libJerasure.$(LIB_EXT) || ( $(MAKE) -C $(JERASURE) && sudo $(MAKE) -C $(JERASURE) install )

$(LIBERAS):
	$(LIB_GUARD) liberasurecode.$(LIB_EXT) || git clone https://bitbucket.org/tsg-/liberasurecode.git $@

$(LIBERAS)/Makefile: | $(LIBERAS)
	$(LIB_GUARD) liberasurecode.$(LIB_EXT) ||  ( cd $(LIBERAS) && ./autogen.sh && ./configure )

$(LIBDIR)/liberasurecode.so: $(LIBERAS)/Makefile
	$(LIB_GUARD) liberasurecode.$(LIB_EXT) || ( $(MAKE) -C $(LIBERAS) && $(MAKE) -C $(LIBERAS) test \
		&& sudo $(MAKE) -C $(LIBERAS) install )

clean:
	$(RM) $(TARGET)

distclean: clean
	$(RM) -r $(GF) $(JERASURE) $(LIBERAS)

re: distclean all

.PHONY: all clean distclean re
