#!/bin/bash

export VFBclasses=/opt/tomcat/webapps/VFB/WEB-INF/classes
export branch=docker-server

#start / force restart of ontology server 
deploy/start-Ont-Server.sh 
