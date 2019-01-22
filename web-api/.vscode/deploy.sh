#!/bin/bash

project="jncc-web-api"
host="esdm-xen1-04.esdm.co.uk"
user="esdm"
remotepath="/home/esdm/dotnet-published"

ssh $user@$host "cd $remotepath && ./pre-deploy.sh $project"
[ $? -ne 0 ] && echo "Pre Deploy Task Failed!" && exit 1
dotnet clean && dotnet publish -c Release -o .publish
[ $? -ne 0 ] && echo "Build/Publish Task Failed!" && exit 1
ssh $user@$host "cd $remotepath/$project && rm -Rf *"
[ $? -ne 0 ] && echo "Deploy Clean Failed!" && exit 1
sftp "$user@$host:$remotepath/$project" <<EOF
mput -r .publish/*
EOF
[ $? -ne 0 ] && echo "Deploy Transfer Failed!" && exit 1
ssh $user@$host "cd $remotepath && ./post-deploy.sh $project"
[ $? -ne 0 ] && echo "Post Deploy Task Failed!" && exit 1
echo "Deploy Finished Successfully!"
