FROM centos:centos6

RUN yum install -y java-1.7.0-openjdk tomcat6 unzip

RUN curl -sS http://maven.forgerock.org/repo/releases/org/forgerock/openam/openam-distribution-kit/12.0.0/openam-distribution-kit-12.0.0.zip > /tmp/openam.zip
RUN unzip /tmp/openam.zip
RUN cp /openam/OpenAM-12.0.0.war /var/lib/tomcat6/webapps/openam.war

RUN chown -R tomcat:tomcat /usr/share/tomcat6

RUN yum install -y httpd mod_ssl
ADD openam-proxy.conf /etc/httpd/conf.d/openam-proxy.conf

CMD /etc/init.d/tomcat6 start && wait && /etc/init.d/httpd start && wait && tail -f /var/log/tomcat6/catalina.out

# admin: password
# policy user: password1
