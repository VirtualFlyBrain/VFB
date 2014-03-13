#Notes on Git Deployment
Some data is changed during upload and download and should be kept in mind when editing code referencing webserver variables or dealing with wlz image files. 
##Recommended general filters

For general editing of repository no filters should be required however to edit large files that have been compressed or split see deploy/README.md on how to edit. 

Do not just decompress manually!


##Server required filters

**These filters are now all deployed via script in deploy directory see deploy/README.md**

**The following is now only for reference:**

The filters modify various markers and urls for the Main or with the Dev or Sandbox servers

Added to .git/config: (edit first section to modify all sub filters - not required for Main-Server)
```shell
[filter "modify-gen"]
    smudge = sed -f filters/Local-Dev-Server-Smudge.sed
    clean = sed -f filters/Local-General-Clean.sed
[filter	"modify-GA"]
    smudge = sed -f filters/FiltGoogleAnSmudge.sed
    clean = sed -f filters/FiltGoogleAnClean.sed
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

```
Added to .git/info/attributes:
```shell
Filt*Smudge.sed filter=modify-gen
ga.jsp filter=modify-GA
```
Note: above only needed for Dev or Sandbox.
```shell
tiledImageModelD*.jso filter=modify-tiled-image-data
resources.properties filter=modify-res-prop
w*.xml filter=modify-web-xml
s*.xml filter=modify-ref-gen
???*.jsp filter=modify-ref-gen
*.htm filter=modify-ref-gen
*.js filter=modify-ref-gen
*.owl filter=modify-ref-gen
```
