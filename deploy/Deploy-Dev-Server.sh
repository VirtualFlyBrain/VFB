#!/bin/bash

export branch=Dev-Server

echo Deploying ${branch}...

#Run shared script to update all variables
deploy/update.sh
