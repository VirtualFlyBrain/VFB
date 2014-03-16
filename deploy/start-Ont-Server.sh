#!/bin/bash
if [ $branch ] && [ $VFBclasses ]
then
  path=${VFBclasses}
  #checking if server is already running
  psCmd=`ps ax |grep 'client_server.Server'  | grep '${path}/../lib/servlet' | awk '{print $1}'`
  if [ $psCmd ]
  then
    echo "Ontology server is already running"
    echo "Killing "$psCmd
	  kill -9 $psCmd
	  wait
	  echo "Killed old processes."
	fi
  wait
  echo Starting Ontology Server for $branch
  echo codebase: $path
  cd $path
  #Note: path variable usage is so the run can be distinguised for forced shutdown.
  nohup nice java -classpath ../lib/postgresql-9.0-801.jdbc3.jar:../lib/commons-pool.jar:../lib/commons-dbcp.jar:${path}/../lib/servlet-api.jar:../lib/spring.jar:../lib/jfact.jar:../lib/owlapi-bin.jar:../lib/oboformat-all.jar:../lib/commons-logging.jar:../lib/log4j-1.2.15.jar:../lib/elk-owlapi.jar:../lib/owltools-oort-all.jar:../lib/brain-1.4.1-2.jar:. -Djava.rmi.server.codebase=file:$path -Dlog4j.configuration=./log4j.properties uk.ac.ed.vfb.dao.client_server.Server & > /tmp/Ont-${branch}.log
else
  echo "Must be run from specific server script"
fi  
