#!/bin/bash

project="jncc-web-api"
host="esdm-xen1-04.esdm.co.uk"
# livehost="ec2-63-34-227-23.eu-west-1.compute.amazonaws.com"
livehost="staging.api.emodnet-seabedhabitats.eu"
user="esdm"
remotepath="/home/esdm/dotnet-published"

echo "Running Deploy to Staging Task on EMODnet server...."
ssh $user@$host "mkdir $remotepath 2>/dev/null; rsync -e ssh -zauvE --delete --progress --exclude=appsettings.json  --exclude=appsettings.mpa.json --exclude=appsettings.esdm.json $remotepath/$project $user@$livehost:$remotepath"
[ $? -ne 0 ] && echo "Deploy to Staging Task Failed!" && exit 1

echo "Installing Correct Configuration on EMODnet Staging Server and Restarting Process..."
rc="ssh $user@$livehost \"cd $remotepath/$project && cp -f appsettings.emod.json appsettings.json && cp -f appsettings.emod.json appsettings.Development.json && kill \\\$(pgrep -f -o '$project')\""
echo $rc
ssh $user@$host "$rc"
[ $? -ne 0 ] && echo "Installing Configuration and Restarting Failed!" && exit 1
