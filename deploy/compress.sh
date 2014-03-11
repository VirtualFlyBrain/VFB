#!/bin/bash

if [ -d .git ]
then    
    echo "Compressing any *.wlz data..."
    for filename in `find . -name '*.wlz'`
    do
        mergedname=${filename}.gz
        echo compressing ${filename} keeping original file.
        pigz -9kf ${filename}
        partname=${filename}.gz.part-
        echo splitting ${mergedname} into 48mb pieces - ${partname}??  
        split -b 48m ${mergedname} ${partname}
        echo completed packaging ${filename} for push to GITHUB
    done
else
    echo "Error: Git directory not found! This script should be run in the git base directory e.g. /disk/data/tomcat/fly/webapps/vfb?/"
fi