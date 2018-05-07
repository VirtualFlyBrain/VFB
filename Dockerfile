FROM devbeta/tomcat6:6.0.45-jdk7-1.7.0_79

ENV branch=Main-Server
ENV flybase=latest

RUN yum -y update && yum -y install git ant nano daemonize pigz

RUN cd /opt/tomcat/webapps/ && \
rm -rf ROOT && \
git clone https://github.com/VirtualFlyBrain/VFB.git -b docker-server ROOT

RUN cd /opt/tomcat/webapps/ROOT/ && \
deploy/decompress.sh

RUN cd /opt/tomcat/webapps/ROOT/ && \
deploy/Deploy-Main-Server.sh
