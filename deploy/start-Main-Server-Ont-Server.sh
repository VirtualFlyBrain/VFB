#!/bin/bash

export VFBclasses=/opt/tomcat/webapps/ROOT/WEB-INF/classes
export branch=Main-Server

#start / force restart of ontology server 
deploy/start-Ont-Server.sh 
