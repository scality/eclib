TARGET		= build/Release/node-eclib.node
GF			= gf_complete
JERASURE	= Jerasure
LIBERAS		= erasurecode

LIBDIR		= /usr/local/lib
LIBS		= $(addsuffix .so, $(GF) $(JERASURE) $(LIBERAS))
DEPS		= $(addprefix $(LIBDIR)/lib, $(LIBS))


all: $(TARGET)

$(TARGET): $(DEPS)
	sudo npm install -g node-gyp

$(GF):
	git clone http://lab.jerasure.org/jerasure/gf-complete.git $@

$(GF)/Makefile: | $(GF)
	cd $(GF) && ./autogen.sh && ./configure

$(LIBDIR)/libgf_complete.so: $(GF)/Makefile
	$(MAKE) -C $(GF) && sudo $(MAKE) -C $(GF) install

$(JERASURE):
	git clone http://lab.jerasure.org/jerasure/jerasure.git $@

$(JERASURE)/Makefile: | $(JERASURE)
	cd $(JERASURE) && autoreconf --force --install -I m4 && ./configure

$(LIBDIR)/libJerasure.so: $(JERASURE)/Makefile
	$(MAKE) -C $(JERASURE) && sudo $(MAKE) -C $(JERASURE) install

$(LIBERAS):
	git clone https://bitbucket.org/tsg-/liberasurecode.git $@

$(LIBERAS)/Makefile: | $(LIBERAS)
	cd $(LIBERAS) && ./autogen.sh && ./configure

$(LIBDIR)/liberasurecode.so: $(LIBERAS)/Makefile
	$(MAKE) -C $(LIBERAS) && $(MAKE) -C $(LIBERAS) test \
		&& sudo $(MAKE) -C $(LIBERAS) install

clean:
	$(RM) $(TARGET)

distclean: clean
	$(RM) -r $(GF) $(JERASURE) $(LIBERAS)
	sudo $(RM) $(DEPS)

re: distclean all

.PHONY: all clean distclean re
