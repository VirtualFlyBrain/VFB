#!/bin/bash

export VFBclasses=/usr/local/tomcat-6/webapps/vfb3sb/WEB-INF/classes
export branch=Sandbox3-Server

#start / force restart of ontology server 
deploy/start-Ont-Server.bsh 
