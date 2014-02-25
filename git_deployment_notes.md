#
##Recommended general filters
Note: Only needed if you intend to modify or open wlz image files.
De/Re-compresses wlz files as files tend to be over Github max file size limit 

Added to .git/config:

[filter "zip-wlz"]
    smudge = gzip -d
    clean = gzip -9
    
Added to .git/info/attributes:
*.wlz filter=zip-wlz
*.wlz.gz filter=zip-wlz 

Note: smudged wlz files won't be appended with .gz this is just to cover all bases.  


##Server required filters

Amend www.virtualflybrain.org and vfb in the smudge and clean of each filter respectively:
Main-Server:	www.virtualflybrain.org	vfb
Dev-Server:	vfbdev.inf.ed.ac.uk	vfbdev
Sandbox-Server:	vfbsandbox.inf.ed.ac.uk	vfbsb 

Added to .git/config:
[filter "modify-res-prop"]
    smudge = sed 's/server_name=vfb/server_name=www.virtualflybrain.org/'
    clean = sed 's/server_name=vfb-karenin.inf.ed.ac.uk/server_name=vfb/'
[filter "modify-web-xml"]
    smudge = sed 's/WEBAPP_NAME/vfb/'
    clean = sed 's/vfb/WEBAPP_NAME/'
[filter "zip-wlz"]
    smudge = gzip -d
    clean = gzip -9
    
Added to .git/info/attributes:
web.xml filter=modify-web-xml
*.wlz filter=zip-wlz
*.wlz.gz filter=zip-wlz



