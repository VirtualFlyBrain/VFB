#!/bin/bash
if [ $branch ] && [ $VFBclasses ]
then
  path=${VFBclasses}
  #checking if server is already running
  psCmd=`ps ax |grep 'client_server.Server'  | grep ${path} | awk '{print $1}'`
  if [ $psCmd ]
  then
    om tomcat stop
    echo "Ontology server is already running"
    echo "Killing "$psCmd
	  kill -9 $psCmd
	  sleep 10s
	  echo "Killed old processes."
	fi
  wait
  echo Starting Ontology Server for $branch
  echo codebase: $path
  cd $path
  echo "--RESTART--" > ../../logs/ontServer.log
  #Note: path variable usage is so the run can be distinguised for forced shutdown.
  nice /usr/sbin/daemonize -a -c $path -e $path/../../logs/ontServer.log -o $path/../../logs/ontServer.log -p $path/../../logs/ontServer-pid.log -E BUILD_ID=dontKillMe /usr/lib/jvm/java-1.7.0-sun/bin/java -classpath ../lib/postgresql-9.0-801.jdbc3.jar:../lib/commons-pool.jar:../lib/commons-dbcp.jar:${path}/../lib/servlet-api.jar:../lib/spring.jar::../lib/commons-logging.jar:../lib/log4j.jar:../lib/Brain-1.5.1-jar-with-dependencies.jar:../lib/elk-owlapi.jar:../lib/owltools-oort-all.jar:. -Djava.rmi.server.codebase=file:$path -Dlog4j.configuration=./log4j.properties uk.ac.ed.vfb.dao.client_server.Server
  # nohup nice /usr/lib/jvm/java-1.7.0-sun/bin/java -classpath ../lib/postgresql-9.0-801.jdbc3.jar:../lib/commons-pool.jar:../lib/commons-dbcp.jar:${path}/../lib/servlet-api.jar:../lib/spring.jar::../lib/commons-logging.jar:../lib/log4j.jar:../lib/Brain-1.5.1-jar-with-dependencies.jar:../lib/elk-owlapi.jar:../lib/owltools-oort-all.jar:. -Djava.rmi.server.codebase=file:$path -Dlog4j.configuration=./log4j.properties uk.ac.ed.vfb.dao.client_server.Server > ../../logs/ontServer.log 2>&1 &

echo 'waiting for the ontology server to initialise...'
MAX_WAIT=24
until [ `cat ../../logs/ontServer.log | grep "Wainting for a connection" | wc -l` -gt 0 ] || [ $MAX_WAIT -lt 1 ]; do
   sleep 5s
   let MAX_WAIT=MAX_WAIT-1
done
let MAX_WAIT=(24-MAX_WAIT)*5
echo Ontology server restart took ${MAX_WAIT} Seconds
om tomcat restart
else
  echo "Must be run from specific server script"
fi
