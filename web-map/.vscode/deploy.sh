#!/bin/bash

project="jncc-web-map"
host="esdm-xen1-04.esdm.co.uk"
user="esdm"
remotepath="/home/esdm/web-published"

echo "Building solution in Production mode..."
ng build --prod
[ $? -ne 0 ] && echo "Build/Publish Task Failed!" && exit 1
ssh $user@$host "cd $remotepath/$project && rm -Rf *"
[ $? -ne 0 ] && echo "Deploy Clean Failed!" && exit 1
sftp "$user@$host:$remotepath/$project" <<EOF
mput -r dist/web-map/*
EOF
[ $? -ne 0 ] && echo "Deploy Transfer Failed!" && exit 1
echo "Deploy Finished Successfully!"
