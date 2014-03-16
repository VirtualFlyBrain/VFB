#!/bin/bash

export VFBclasses=/usr/local/tomcat-6/webapps/vfbsb/WEB-INF/classes
export branch=Sandbox-Server

#start / force restart of ontology server 
deploy/start-Ont-Server.bsh 
