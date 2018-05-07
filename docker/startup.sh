#!/bin/bash

cd /opt/tomcat/webapps/
rm -rf ROOT
git clone https://github.com/VirtualFlyBrain/VFB.git -b docker-server ROOT
cd /opt/tomcat/webapps/ROOT/
deploy/decompress.sh
cd /opt/tomcat/webapps/ROOT/
deploy/Deploy-Main-Server.sh

tail -F /opt/tomcat/logs/ontServer.log &
tail -F /opt/tomcat/logs/catalina.out &
