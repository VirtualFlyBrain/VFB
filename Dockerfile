FROM tomcat:7

ENV branch=docker-server
ENV flybase=latest

RUN apt-get -y update -q && apt-get -y -q install git ant nano daemonize pigz

RUN git clone -b $branch https://github.com/VirtualFlyBrain/VFB.git /usr/local/tomcat/webapps/vfb

RUN cd /usr/local/tomcat/webapps/vfb && \
deploy/Deploy-docker-server.sh

COPY docker/startup.sh /startup.sh

RUN chmod +x /startup.sh

ENTRYPOINT ["/startup.sh"]
