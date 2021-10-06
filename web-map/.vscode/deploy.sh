#!/bin/bash

project="jncc-web-map"
host="jnccdev-map.esdm.co.uk"
user="esdm"
remotepath="/home/esdm/web-published"

echo "Building solution in Production mode..."
ng build --prod --extract-css=false
[ $? -ne 0 ] && echo "Build/Publish Task Failed!" && exit 1

echo "Cleaning Remote Deployment Directory..."
ssh $user@$host "cd $remotepath/$project && rm -Rf *"
[ $? -ne 0 ] && echo "Deploy Clean Failed!" && exit 1

echo "Deploying Files to Remote Server..."
sftp "$user@$host:$remotepath/$project" <<EOF
mput -r dist/web-map/*
EOF
[ $? -ne 0 ] && echo "Deploy Transfer Failed!" && exit 1

echo "Installing Correct Configuration..."
ssh $user@$host "cd $remotepath/$project/assets/config && cp -f config.prod.esdm.json config.prod.json"
[ $? -ne 0 ] && echo "Installing Configuration Failed!" && exit 1

echo "Deploy Finished Successfully!"
