#!/bin/bash


cd /opt/tomcat/webapps/

git clone https://github.com/VirtualFlyBrain/VFB.git -b docker-server

cd /opt/tomcat/webapps/VFB/
deploy/decompress.sh

echo 'Starting Server...' >> /opt/tomcat/webapps/ROOT/logs/ontServer.log
chmod -R 777 /opt/tomcat/webapps/ROOT/logs/ontServer.log

cd /opt/tomcat/webapps/VFB/
deploy/Deploy-Main-Server.sh

tail -F /opt/tomcat/logs/catalina.out &
tail -F /opt/tomcat/webapps/VFB/logs/ontServer.log

sed -i 's|<Connector port="8009"|<Connector port="80" maxHttpHeaderSize="8192" maxThreads="150" minSpareThreads="25" maxSpareThreads="75" proxyName="vfb" proxyPort="80" enableLookups="false" redirectPort="8443" acceptCount="100" connectionTimeout="20000" disableUploadTimeout="true" useURIValidationHack="false" />\n<Connector port="8009"|g' server.xml
sed -i 's|</Host>|</Host>\n<Host name="vfb" debug="1" appBase="webapps" unpackWARS="false" autoDeploy="false" deployOnStartup="false">\n           <Context path="" reloadable="true"\n               docBase="/opt/tomcat/webapps/VFB/">\n           </Context>\n     </Host>|g' server.xml

service tomcat restart
