#!/bin/bash

if [ -d .git ]
then    
    echo "Decompressing any *.gz or *.gz.part-?? data..."
    for filename in `find . -name '*.gz.part-aa'`
    do
        origname=${filename/.gz.part-aa/}
        if [ ${origname} -ot ${origname}.gz.part-aa ]
        then
            mergedname=${filename/gz.part-aa/gz}
            echo merging files to reconstruct ${mergedname}
            cat ${filename/part-aa/part-??} > ${mergedname}
            echo decompressing and removing gzip copy of ${mergedname} 
            pigz -df ${mergedname}
            if [ -f ${mergedname/.owl.gz/}.owl ]
            then
                sed -i -f filters/FiltGenClean.sed ${mergedname/.owl.gz/}.owl
                sed -i -f filters/FiltGenSmudge.sed ${mergedname/.owl.gz/}.owl
            fi
            echo completed deploying ${mergedname/.gz/}
        else
            echo skipping ${filename} as no change.
        fi
    done
    for filename in `find . -name '*.gz'`
    do
        origname=${filename/.gz/}
        if [ ${origname} -ot ${origname}.gz ]
        then
            decomname=${filename/.gz/}
            echo decompressing and keeping gzip copy of ${filename} 
            pigz -dkf ${filename}
            if [ -f ${decomname/.owl/}.owl ]
                then
                    sed -i -f filters/FiltGenClean.sed ${mergedname/.owl.gz/}.owl
                    sed -i -f filters/FiltGenSmudge.sed ${mergedname/.owl.gz/}.owl
                fi
            echo completed deploying ${decomname}
        else
            echo skipping ${filename} as no change.
        fi
    done 
else
    echo "Error: Git directory not found! This script should be run in the git base directory e.g. /disk/data/tomcat/fly/webapps/vfb?/"
fi
