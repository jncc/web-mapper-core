#!/bin/bash

project="jncc-web-api"
host="jnccdev-api.esdm.co.uk"
user="esdm"
remotepath="/home/esdm/dotnet-published"

which rsync >/dev/null 2>&1
missing_rsync=$?

echo "Running Pre Deploy Task on server...."
ssh $user@$host "cd $remotepath && ./pre-deploy.sh $project"
[ $? -ne 0 ] && echo "Pre Deploy Task Failed!" && exit 1

echo "Building and Publishing Application..."
dotnet clean && dotnet publish -c Release -o .publish
[ $? -ne 0 ] && echo "Build/Publish Task Failed!" && exit 1

if [ $missing_rsync -eq 1 ]; then
    echo "Cleaning out deployment directory on server..."
    ssh $user@$host "cd $remotepath/$project && rm -Rf *"
    [ $? -ne 0 ] && echo "Deploy Clean Failed!" && exit 1
fi

find .publish -name "*.dll" -exec chmod 644 \{\} \;

echo "Deploying Application to server..."
if [ $missing_rsync -eq 1 ]; then
    sftp "$user@$host:$remotepath/$project" <<EOF
    mput -r .publish/*
EOF
else
    rsync -e ssh -zauvE --delete --progress .publish/* "$user@$host:$remotepath/$project/"
fi
[ $? -ne 0 ] && echo "Deploy Transfer Failed!" && exit 1

echo "Installing Correct Configuration..."
ssh $user@$host "cd $remotepath/$project && cp -f appsettings.esdm.json appsettings.json"
[ $? -ne 0 ] && echo "Installing Configuration Failed!" && exit 1

echo "Running Post Deploy Task on server...."
ssh $user@$host "cd $remotepath && ./post-deploy.sh $project"
[ $? -ne 0 ] && echo "Post Deploy Task Failed!" && exit 1
echo "Deploy Finished Successfully!"
