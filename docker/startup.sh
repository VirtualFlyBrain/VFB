#!/bin/bash

cd /opt/tomcat/webapps/ROOT/
deploy/update.sh

tail -F /opt/tomcat/logs/ontServer.log &
tail -F /opt/tomcat/logs/catalina.out &
