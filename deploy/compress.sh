#!/bin/bash

if [ -d .git ]
then    
    echo "Compressing any *.wlz data..."
    for filename in `find . -name '*.wlz'`
    do
        if [ `date -r ${filename} +%s` -gt `expr $(date -r ${filename}.gz.part-aa +%s) + 1000` ]
        then
	        mergedname=${filename}.gz
	        echo compressing ${filename} keeping original file.
	        pigz -9kf ${filename}
	        partname=${filename}.gz.part-
	        echo splitting ${mergedname} into 48mb pieces - ${partname}??
	        split -b 48m ${mergedname} ${partname}
	        rm ${mergedname}
	        echo completed packaging ${filename} for push to GITHUB
	else
		echo skipping ${filename} as no change.
        fi
    done
    echo "Compressing any *.owl data..."
    for filename in `find . -name '*.owl'`
    do
    	if [ `date -r ${filename} +%s` -gt `expr $(date -r ${filename}.gz.part-aa +%s) + 1000` ]
        then
		if [[ ${filename} == "./owl/"* ]]
		then
			echo Skipping ${filename}
		else
	        	mergedname=${filename}.gz
	        	echo compressing ${filename} keeping original file.
	        	pigz -9kf ${filename}
	        	partname=${filename}.gz.part-
	        	echo splitting ${mergedname} into 48mb pieces - ${partname}??
	        	split -b 48m ${mergedname} ${partname}
	        	rm ${mergedname}
	        	echo completed packaging ${filename} for push to GITHUB
		fi
	else
		echo skipping ${filename} as no change.
        fi
    done
else
    echo "Error: Git directory not found! This script should be run in the git base directory e.g. /disk/data/tomcat/fly/webapps/vfb?/"
fi
