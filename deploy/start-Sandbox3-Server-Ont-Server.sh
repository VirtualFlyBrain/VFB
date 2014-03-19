#!/bin/bash

export VFBclasses=/usr/local/tomcat-6/webapps/vfb2sb/WEB-INF/classes
export branch=Sandbox2-Server

#start / force restart of ontology server 
deploy/start-Ont-Server.sh 
