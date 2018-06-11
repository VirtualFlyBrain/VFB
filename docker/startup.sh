#!/bin/bash


cd /opt/tomcat/webapps/
rm -rf ROOT
git clone https://github.com/VirtualFlyBrain/VFB.git -b docker-server ROOT

cd /opt/tomcat/webapps/ROOT/
deploy/decompress.sh

echo 'Starting Server...' >> /opt/tomcat/webapps/ROOT/logs/ontServer.log
chmod -R 777 /opt/tomcat/webapps/ROOT/logs/ontServer.log

cd /opt/tomcat/webapps/ROOT/
deploy/Deploy-Main-Server.sh

tail -F /opt/tomcat/logs/catalina.out &
tail -F /opt/tomcat/webapps/ROOT/logs/ontServer.log
