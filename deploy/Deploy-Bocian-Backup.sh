#!/bin/bash

export branch=Bocian-Backup

echo Deploying ${branch}...

#Run shared script to update all variables
deploy/update.sh
