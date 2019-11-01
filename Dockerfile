FROM tomcat:7-jdk8-openjdk

ARG branch=docker-server
ARG flybase=latest

RUN apt-get -y update -q && apt-get -y -q install git ant nano daemonize pigz 

RUN mkdir -p /disk/data/tomcat 

RUN ln -s /usr/local/tomcat /disk/data/tomcat/fly

COPY docker/startup.sh /startup.sh

RUN chmod +x /startup.sh

RUN git clone -b $branch --single-branch https://github.com/VirtualFlyBrain/VFB.git /usr/local/tomcat/webapps/vfb

RUN mkdir -p /usr/local/tomcat/lib/old && mv -v /usr/local/tomcat/lib/*.jar /usr/local/tomcat/lib/old/ && mv -v /usr/local/tomcat/webapps/vfb/docker/lib/*.jar /usr/local/tomcat/lib/ 

RUN mkdir -p /usr/local/tomcat/conf/Catalina/localhost && mv -v /usr/local/tomcat/webapps/vfb/docker/manager.xml /usr/local/tomcat/conf/Catalina/localhost/
RUN mv -v /usr/local/tomcat/webapps/vfb/docker/*.xml /usr/local/tomcat/conf/
RUN mv -v /usr/local/tomcat/webapps/vfb/docker/*.p* /usr/local/tomcat/conf/

RUN cd /usr/local/tomcat/webapps/vfb && \
deploy/Deploy-docker-server.sh

ENTRYPOINT ["/startup.sh"]
