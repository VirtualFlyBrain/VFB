#!/bin/bash

if [ -d .git ]
then    
    echo "Decompressing any *.gz or *.gz.part-?? data..."
    for filename in `find . -name '*.gz.part-aa'`
    do
        mergedname=${filename/gz.part-aa/gz}
        echo merging files to reconstruct ${mergedname}
        cat ${filename/part-aa/part-??} > ${mergedname}
        echo decompressing and removing gzip copy of ${mergedname} 
        pigz -df ${mergedname}
        echo completed deploying ${mergedname/.qz/}
    done
    for filename in `find . -name '*.gz'`
    do
        decomname=${filename/.gz/}
        echo decompressing and keeping gzip copy of ${filename} 
        pigz -dkf ${filename}
        echo completed deploying ${decomname}
    done 
else
    echo "Error: Git directory not found! This script should be run in the git base directory e.g. /disk/data/tomcat/fly/webapps/vfb?/"
fi
