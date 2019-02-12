#!/bin/bash

project="jncc-web-map"
host="esdm-xen1-04.esdm.co.uk"
livehost="ec2-63-34-227-23.eu-west-1.compute.amazonaws.com"
user="esdm"
remotepath="/home/esdm/web-published"

echo "Running Deploy to Live Task on server...."
ssh $user@$host "mkdir $remotepath 2>/dev/null; rsync -e ssh -zauvE --delete --progress $remotepath/$project $user@$livehost:$remotepath"
[ $? -ne 0 ] && echo "Deploy to Live Task Failed!" && exit 1

echo "Installing Correct Configuration on Live Server..."
rc="ssh $user@$livehost \"cd $remotepath/$project/assets/config && cp -f config.prod.jncc.json config.prod.json\""
ssh $user@$host "$rc"
[ $? -ne 0 ] && echo "Installing Configuration Failed!" && exit 1
