#!/bin/bash

export VFBclasses=/usr/local/tomcat-6/webapps/vfb/WEB-INF/classes
export branch=Main-Server

#start / force restart of ontology server 
deploy/start-Ont-Server.sh 
