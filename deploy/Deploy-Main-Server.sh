#!/bin/bash

export branch=Main-Server

echo Deploying ${branch}...

#Run shared script to update all variables
deploy/update.sh
