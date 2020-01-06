#!/bin/bash
add-apt-repository universe -y
add-apt-repository ppa:certbot/certbot -y
apt update -y

apt install apache2 certbot python-certbot-apache -y
certbot --non-interactive --agree-tos -m WEBAPI_SERVER_ADMIN_URL -d WEBAPI_URL -d WEBMAP_URL
rm /etc/apache2/sites-enabled/*
cp AWS_INSTANCE_DEPLOY_DIR/BUILD_NUMBER/deployment/apache/*.conf /etc/apache2/sites-available/

a2ensite httpd-live
a2ensite httpd-ssl-live
a2enmod ssl
a2enmod headers
a2enmod socache_shmcb
a2enmod proxy
a2enmod proxy_http
