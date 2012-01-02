#!/bin/bash

echo -e "\nEnter the URL of the database you'd like to install to, including username and password.\n(eg, http://admin:password@localhost:5984/{{app}})\n";

echo -n "Target: ";
while read -u 2 inputline 
do
target="$inputline"

if [ -z "${target}" ];
then
    exit
fi

echo -e "\nCreating the database";
curl -X PUT ${target}

echo -e "\nInstalling the app";
curl -X GET {{app_url}} -H "Accept: application/json" | \
    sed s/\"_rev\"[^,]*,// | \
    curl -X PUT ${target}/_design/{{app}} -H "Content-Type: application/json" -d @- \
    && echo -e "\n${target}/_design/{{app}}{{open_path}}" && exit

done
