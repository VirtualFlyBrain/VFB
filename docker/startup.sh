#!/bin/bash


cd /usr/local/tomcat/webapps

echo 'Starting Server...' >> /usr/local/tomcat/webapps/VFB/logs/ontServer.log
chmod -R 777 /usr/local/tomcat/webapps/VFB/logs/ontServer.log

cd /usr/local/tomcat/webapps/vfb/
deploy/Deploy-$branch.sh

tail -F /usr/local/tomcat/logs/catalina.out &
tail -F /usr/local/tomcat/webapps/vfb/logs/ontServer.log

#sed -i 's|<Connector port="8009"|<Connector port="80" maxHttpHeaderSize="8192" maxThreads="150" minSpareThreads="25" maxSpareThreads="75" proxyName="vfb" proxyPort="80" enableLookups="false" redirectPort="8443" acceptCount="100" connectionTimeout="20000" disableUploadTimeout="true" useURIValidationHack="false" />\n<Connector port="8009"|g' server.xml
#sed -i 's|</Host>|</Host>\n<Host name="vfb" debug="1" appBase="webapps" unpackWARS="false" autoDeploy="false" deployOnStartup="false">\n           <Context path="" reloadable="true"\n               docBase="/opt/tomcat/webapps/VFB/">\n           </Context>\n     </Host>|g' server.xml

/docker-java-home/jre/bin/java -Djava.util.logging.config.file=/usr/local/tomcat/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Djdk.tls.ephemeralDHKeySize=2048 -Djava.protocol.handler.pkgs=org.apache.catalina.webresources -Dorg.apache.catalina.security.SecurityListener.UMASK=0027 -Dignore.endorsed.dirs= -classpath /usr/local/tomcat/bin/bootstrap.jar:/usr/local/tomcat/bin/tomcat-juli.jar -Dcatalina.base=/usr/local/tomcat -Dcatalina.home=/usr/local/tomcat -Djava.io.tmpdir=/usr/local/tomcat/temp org.apache.catalina.startup.Bootstrap start

