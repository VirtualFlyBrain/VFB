#!/bin/bash

export branch=Sandbox1-Server

echo Deploying ${branch}...

#Run shared script to update all variables
deploy/update.sh
