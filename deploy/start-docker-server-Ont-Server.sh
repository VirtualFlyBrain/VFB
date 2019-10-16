#!/bin/bash

export VFBclasses=/disk/data/tomcat/fly/webapps/vfb/WEB-INF/classes
export branch=docker-server

#start / force restart of ontology server 
deploy/start-Ont-Server.sh 
