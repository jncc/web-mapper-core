#!/bin/bash

project="jncc-web-map"
host="esdm-xen1-04.esdm.co.uk"
# livehost="mapper.mpa.jncc.gov.uk"
livehost="staging.mapper.mpa.jncc.gov.uk"
user="esdm"
remotepath="/home/esdm/web-published"

echo "Running Deploy to MPA Staging Task on server...."
ssh $user@$host "mkdir $remotepath 2>/dev/null; rsync -e ssh -zauvE --delete --progress $remotepath/$project $user@$livehost:$remotepath"
[ $? -ne 0 ] && echo "Deploy to Staging Task Failed!" && exit 1

echo "Installing Correct Configuration on MPA Staging Server..."
rc="ssh $user@$livehost \"cd $remotepath/$project/assets/config && cp -f config.prod.mpa.json config.prod.json\""
ssh $user@$host "$rc"
[ $? -ne 0 ] && echo "Installing Configuration Failed!" && exit 1
