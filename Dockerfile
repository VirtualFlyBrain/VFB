FROM tomcat:7-jdk8-openjdk

ARG branch=docker-server
ARG flybase=latest

RUN apt-get -y update -q && apt-get -y -q install git ant nano daemonize pigz 

RUN mkdir -p /disk/data/tomcat 

RUN ln -s /usr/local/tomcat /disk/data/tomcat/fly

COPY docker/startup.sh /startup.sh

COPY docker/server.xml /usr/local/tomcat/conf/server.xml
COPY docker/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml

RUN chmod +x /startup.sh

RUN git clone -b $branch --single-branch https://github.com/VirtualFlyBrain/VFB.git /usr/local/tomcat/webapps/vfb

RUN cd /usr/local/tomcat/webapps/vfb && \
deploy/Deploy-docker-server.sh

ENTRYPOINT ["/startup.sh"]
