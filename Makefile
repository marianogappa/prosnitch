iconsrc := extension/icon-512.png
icondir := extension
iconsizes := {16,19,38,48,128,256}
iconfiles := $(shell echo $(icondir)/icon-$(iconsizes).png)

$(icondir)/icon-%.png:
	@mkdir -p $(@D)
	convert $(iconsrc) -resize $* $@

icons: $(iconfiles)

package:
	rm -f extension.zip
	zip -r -j extension.zip extension/*

.PHONY: icons package
