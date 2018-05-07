FROM devbeta/tomcat6:6.0.45-jdk7-1.7.0_79

ENV branch=Main-Server
ENV flybase=latest

RUN yum -y update && yum -y install git ant nano daemonize 

