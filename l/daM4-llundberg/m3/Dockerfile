FROM httpd:alpine

COPY cgi/* /usr/local/apache2/cgi-bin/
COPY www/* /usr/local/apache2/www/
COPY httpd.conf /usr/local/apache2/conf/httpd.conf

RUN apk update
RUN apk add curl

EXPOSE 80
