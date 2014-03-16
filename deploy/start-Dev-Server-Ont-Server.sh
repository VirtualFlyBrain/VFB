#!/bin/bash

export VFBclasses=/usr/local/tomcat-6/webapps/vfbdev/WEB-INF/classes
export branch=Dev-Server

#start / force restart of ontology server 
deploy/start-Ont-Server.bsh 
