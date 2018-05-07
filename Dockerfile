FROM devbeta/tomcat6:6.0.45-jdk7-1.7.0_79

ENV branch=Main-Server
ENV flybase=latest

RUN yum -y update -q -e 0 && yum -y -q -e 0 install git ant nano daemonize pigz

COPY docker/startup.sh /startup.sh

RUN chmod +x /startup.sh

ENTRYPOINT ["/startup.sh"]
