#!/bin/bash

project="jncc-web-api"
host="esdm-xen1-04.esdm.co.uk"
# livehost="api.mpa.jncc.gov.uk"
livehost="staging.api.mpa.jncc.gov.uk"
user="esdm"
remotepath="/home/esdm/dotnet-published"

echo "Running Deploy to Staging Task on MPA server...."
ssh $user@$host "mkdir $remotepath 2>/dev/null; rsync -e ssh -zauvE --delete --progress --exclude=appsettings.json --exclude=appsettings.emod.json --exclude=appsettings.esdm.json $remotepath/$project $user@$livehost:$remotepath"
[ $? -ne 0 ] && echo "Deploy to Staging Task Failed!" && exit 1

echo "Installing Correct Configuration on MPA Staging Server and Restarting Process..."
rc="ssh $user@$livehost \"cd $remotepath/$project && cp -f appsettings.mpa.json appsettings.json && cp -f appsettings.mpa.json appsettings.Development.json && kill \\\$(pgrep -f -o '$project')\""
echo $rc
ssh $user@$host "$rc"
[ $? -ne 0 ] && echo "Installing Configuration and Restarting Failed!" && exit 1
