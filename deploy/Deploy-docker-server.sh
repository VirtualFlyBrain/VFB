#!/bin/bash

export branch=docker-server

echo Deploying ${branch}...

#Run shared script to update all variables
deploy/update.sh
