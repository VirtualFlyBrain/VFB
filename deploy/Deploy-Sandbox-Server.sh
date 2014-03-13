#!/bin/bash

branch=Sandbox-Server

echo Deploying ${branch}...

#Run shared script to update all variables
deploy/update.sh
