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

Amend www.virtualflybrain.org and vfb in the smudge and clean of each filter respectively:

|   Git Branch      |   url (modify-res-prop)       |   deployment (modify-web-xml)     |
|:---------:|:---------------------:|:----------------------------:|
|   Main-Server     |	www.virtualflybrain.org     |	vfb                             |
|   Dev-Server      |	[vfbdev.inf.ed.ac.uk](http://vfbdev.inf.ed.ac.uk) | vfbdev      |
|   Sandbox-Server  |	[vfbsandbox.inf.ed.ac.uk](http://vfbsandbox.inf.ed.ac.uk) | vfbsb |


Added to .git/config:
```
[filter "modify-res-prop"]
    smudge = sed 's/server_name=VFB/server_name=www.virtualflybrain.org/'
    clean = sed -i 's/server_name=vfbdev.inf.ed.ac.uk/server_name=VFB/g;s/server_name=sandbox.inf.ed.ac.uk/server_name=VFB/g;s/server_name=www.virtualflybrain.org/server_name=VFB/g;'
[filter "modify-web-xml"]
    smudge = sed 's/<param-value>WEBAPP_NAME</param-value>/<param-value>vfb</param-value>/'
    clean = sed -i 's/<param-value>vfbdev</param-value>/<param-value>WEBAPP_NAME</param-value>/g;s/<param-value>vfbsb</param-value>/<param-value>WEBAPP_NAME</param-value>/g;s/<param-value>vfb</param-value>/<param-value>WEBAPP_NAME</param-value>/g;'
[filter "zip-wlz"]
    smudge = gzip -d
    clean = gzip -9
```
Added to .git/info/attributes:
```
web.xml filter=modify-web-xml
*.jso filter=modify-res-prop
*.wlz filter=zip-wlz
*.wlz.gz filter=zip-wlz
```
