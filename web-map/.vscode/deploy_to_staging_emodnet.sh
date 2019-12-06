#!/bin/bash

project="jncc-web-map"
host="esdm-xen1-04.esdm.co.uk"
# livehost="api.emodnet-seabedhabitats.eu"
livehost="staging.api.emodnet-seabedhabitats.eu"
user="esdm"
remotepath="/home/esdm/web-published"

echo "Running Deploy to EMODnet Staging Task on server...."
ssh $user@$host "mkdir $remotepath 2>/dev/null; rsync -e ssh -zauvE --delete --progress $remotepath/$project $user@$livehost:$remotepath"
[ $? -ne 0 ] && echo "Deploy to Staging Task Failed!" && exit 1

echo "Installing Correct Configuration on EMODnet Staging Server..."
rc="ssh $user@$livehost \"cd $remotepath/$project/assets/config && cp -f config.prod.emod.json config.prod.json\""
ssh $user@$host "$rc"
[ $? -ne 0 ] && echo "Installing Configuration Failed!" && exit 1
