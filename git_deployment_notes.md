#Notes on Git Deployment
Some data is changed during upload and download and should be kept in mind when editing code referencing webserver variables or dealing with wlz image files. 
##Recommended general filters
Note: Only needed if you intend to modify or open wlz image files.
De/Re-compresses wlz files as files tend to be over Github max file size limit

Added to .git/config:
```
[filter "zip-wlz"]
    smudge = gzip -d
    clean = gzip -9
```

Added to .git/info/attributes:
```
*.wlz filter=zip-wlz
*.wlz.gz filter=zip-wlz
```

Note: smudged wlz files won't be appended with .gz this is just to cover all bases.


##Server required filters

Amend vfbdev.inf.ed.ac.uk and vfbdev in the smudge of each filter respectively:

|   Git Branch      |   url (modify-url)       |   deployment (modify-app)     |
|:---------:|:---------------------:|:----------------------------:|
|   Main-Server     |	www.virtualflybrain.org     |	vfb                             |
|   Dev-Server      |	[vfbdev.inf.ed.ac.uk](http://vfbdev.inf.ed.ac.uk) | vfbdev      |
|   Sandbox-Server  |	[vfbsandbox.inf.ed.ac.uk](http://vfbsandbox.inf.ed.ac.uk) | vfbsb |


Added to .git/config: (edit first section to modify all filters)
```shell
[filter "modify-url"]
    smudge = sed 's/www.virtualflybrain.org/vfbdev.inf.ed.ac.uk/'
    clean = sed 's/vfbdev.inf.ed.ac.uk/www.virtualflybrain.org/'
[filter "modify-app"]
    smudge = sed 's/>vfb</>vfbdev</'
    clean = sed 's/>vfbdev</>vfb</'
[filter "modify-gen"]
    smudge = sed '/webapps/s/vfb/vfbdev/'
    clean = sed '/webapps/s/vfbdev/vfb/'
```

```

[filter "modify-ref-gen"]
    smudge = sed -f filters/FiltGenSmudge.sed
    clean = sed -f filters/FiltGenClean.sed

[filter "modify-res-prop"]
    smudge = sed -f filters/FiltResPropSmudge.sed
    clean = sed -f filters/FiltResPropClean.sed
[filter "modify-web-xml"]
    smudge = sed -f filters/FiltWebXmlSmudge.sed
    clean = sed -f filters/FiltWebXmlClean.sed
[filter "modify-tiled-image-data"]
    smudge = sed -f filters/FiltTiledImageModelDataSmudge.sed
    clean = sed -f filters/FiltTiledImageModelDataClean.sed


[filter "zip-wlz"]
    smudge = gzip -d
    clean = gzip -9
```
Added to .git/info/attributes:
```shell
Filt*Smudge.sed filter=modify-url
FiltW*Smudge.sed filter=modify-app
FiltGenSmudge.sed filter=modify-gen
tiledImageModelD*.jso filter=modify-tiled-image-data
resources.properties filter=modify-res-prop
*.xml filter=modify-web-xml
*.wlz filter=zip-wlz
*.wlz.gz filter=zip-wlz
*.js filter=modify-ref-gen
*.htm filter=modify-ref-gen
*.jsp filter=modify-ref-gen
*.owl filter=modify-ref-gen
```
