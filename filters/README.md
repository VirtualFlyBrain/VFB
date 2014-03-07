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

Note: smudged wlz files won't be appended with .gz; it's inclusion is just to cover all bases.

##Server required filters

The filters modify various markers and urls for the Main or with the Dev or Sandbox servers

Added to .git/config: (edit first section to modify all sub filters - not required for Main-Server)
```shell
[filter "modify-gen"]
    smudge = sed -f filters/Local-Dev-Server-Smudge.sed
    clean = sed -f filters/Local-General-Clean.sed
```
Note: above only needed for Dev or Sandbox.
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
Filt*Smudge.sed filter=modify-gen
```
Note: above only needed for Dev or Sandbox.
```shell
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
