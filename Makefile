TARGET		= build/Release/node-eclib.node
GF			= gf_complete
JERASURE	= Jerasure
LIBERAS		= erasurecode

LIBDIR		= /usr/local/lib
LIBS		= $(addsuffix .so, $(GF) $(JERASURE) $(LIBERAS))
DEPS		= $(addprefix $(LIBDIR)/lib, $(LIBS))

ifeq ($(shell uname -s),Linux)
LIB_GUARD = ldconfig -p | grep
else
LIB_GUARD = false
endif

all: $(TARGET)

$(TARGET): $(DEPS)
	sudo npm install -g node-gyp

$(GF):
	$(LIB_GUARD) libgf_complete.so || git clone http://lab.jerasure.org/jerasure/gf-complete.git $@

$(GF)/Makefile: | $(GF)
	$(LIB_GUARD) libgf_complete.so || ( cd $(GF) && ./autogen.sh && ./configure )

$(LIBDIR)/libgf_complete.so: $(GF)/Makefile
	$(LIB_GUARD) libgf_complete.so || ( $(MAKE) -C $(GF) && sudo $(MAKE) -C $(GF) install )

$(JERASURE):
	$(LIB_GUARD) libJerasure.so || git clone http://lab.jerasure.org/jerasure/jerasure.git $@

$(JERASURE)/Makefile: | $(JERASURE)
	$(LIB_GUARD) libJerasure.so || ( cd $(JERASURE) && autoreconf --force --install -I m4 && ./configure )

$(LIBDIR)/libJerasure.so: $(JERASURE)/Makefile
	$(LIB_GUARD) libJerasure.so || ( $(MAKE) -C $(JERASURE) && sudo $(MAKE) -C $(JERASURE) install )

$(LIBERAS):
	$(LIB_GUARD) liberasurecode.so || git clone https://bitbucket.org/tsg-/liberasurecode.git $@

$(LIBERAS)/Makefile: | $(LIBERAS)
	$(LIB_GUARD) liberasurecode.so ||  ( cd $(LIBERAS) && ./autogen.sh && ./configure )

$(LIBDIR)/liberasurecode.so: $(LIBERAS)/Makefile
	$(LIB_GUARD) liberasurecode.so || ( $(MAKE) -C $(LIBERAS) && $(MAKE) -C $(LIBERAS) test \
		&& sudo $(MAKE) -C $(LIBERAS) install )

clean:
	$(RM) $(TARGET)

distclean: clean
	$(RM) -r $(GF) $(JERASURE) $(LIBERAS)

re: distclean all

.PHONY: all clean distclean re
