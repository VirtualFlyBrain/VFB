#!/bin/bash

export branch=Sandbox3-Server

echo Deploying ${branch}...

#Run shared script to update all variables
deploy/update.sh
