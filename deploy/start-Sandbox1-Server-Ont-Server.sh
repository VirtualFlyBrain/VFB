#!/bin/bash

export VFBclasses=/usr/local/tomcat-6/webapps/vfb1sb/WEB-INF/classes
export branch=Sandbox1-Server

#start / force restart of ontology server 
deploy/start-Ont-Server.bsh 
