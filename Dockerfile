FROM devbeta/tomcat6:6.0.45-jdk7-1.7.0_79

ENV branch=Main-Server
ENV flybase=latest

RUN yum -y update -q -e 0 && yum -y -q -e 0 install git ant nano daemonize pigz

RUN cd /opt/tomcat/webapps/ && \
rm -rf ROOT && \
git clone https://github.com/VirtualFlyBrain/VFB.git -b docker-server ROOT && \
cd /opt/tomcat/webapps/ROOT/ && \
deploy/decompress.sh && \
cd /opt/tomcat/webapps/ROOT/ && \
deploy/Deploy-Main-Server.sh

