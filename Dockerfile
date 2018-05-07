FROM devbeta/tomcat6:6.0.45-jdk7-1.7.0_79

ENV branch=Main-Server
ENV flybase=latest

RUN apt-get -y update && apt-get -y install git ant nano daemonize 

