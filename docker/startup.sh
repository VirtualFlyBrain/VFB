#!/bin/bash


cd /usr/local/tomcat/webapps

echo 'Starting Server...' > /usr/local/tomcat/webapps/vfb/logs/ontServer.log
chmod -R 777 /usr/local/tomcat/webapps/vfb/logs/ontServer.log

cd /usr/local/tomcat/webapps/vfb/
deploy/start-docker-server-Ont-Server.sh

#tail -F /usr/local/tomcat/logs/catalina.out &
tail -F /usr/local/tomcat/webapps/vfb/logs/ontServer.log &


#sed -i 's|<Connector port="8009"|<Connector port="80" maxHttpHeaderSize="8192" maxThreads="150" minSpareThreads="25" maxSpareThreads="75" proxyName="vfb" proxyPort="80" enableLookups="false" redirectPort="8443" acceptCount="100" connectionTimeout="20000" disableUploadTimeout="true" useURIValidationHack="false" />\n<Connector port="8009"|g' server.xml
#sed -i 's|</Host>|</Host>\n<Host name="vfb" debug="1" appBase="webapps" unpackWARS="false" autoDeploy="false" deployOnStartup="false">\n           <Context path="" reloadable="true"\n               docBase="/opt/tomcat/webapps/VFB/">\n           </Context>\n     </Host>|g' server.xml

/usr/local/tomcat/bin/catalina.sh run

