#!/bin/bash
#Called from deployment scripts
if [ -d .git ] && [ $branch ]
then
    current=`git rev-parse HEAD`
    nice ssh-agent bash -c 'ssh-add /disk/data/Home/$USER/.ssh/id_dsa; git pull origin $branch' 2>&1
    nice ssh-agent bash -c 'ssh-add /disk/data/Home/$USER/.ssh/id_dsa; git fetch --tags' 2>&1
#    test and add git server filters if required.
    if [ ! -f .git/info/attributes ]
    then
        echo "Adding git Smudge/Clean filters..."
        cp deploy/config .git/
        if [ ! -d .git/info ]
        then
            mkdir .git/info
        fi
        cp deploy/attributes .git/info/
        sed -i s/BRANCH_NAME/${branch}/g .git/config

        nice deploy/decompress.sh

        echo "recording git branch and version details"
        git describe --long > revision
        echo $branch > branch
        cp /disk/data/VFB/Chado/VFB_DB/current/revision flybase
        head -n 100 resources/fbbt-simple.owl | grep versionIRI | sed 's/^[^"]*"\([^"]*\)".*/\1/' > owldate
        echo "which are:"
        cat branch
        cat revision
        echo "Flybase version:"
        cat flybase
        echo "OWL date:"
        cat owldate

        echo "checking filters to use correct branch names"
        find filters/ -name 'Filt*Smudge.sed' | xargs sed -i -f filters/Local-General-Clean.sed
        find filters/ -name 'Filt*Smudge.sed' | xargs sed -i -f filters/Local-${branch}-Smudge.sed

        echo "checking image json files"
        find data/flybrain/ -name 'tiledImageModelD*.jso' | xargs sed -i -f filters/FiltTiledImageModelDataClean.sed
        find data/flybrain/ -name 'tiledImageModelD*.jso' | xargs sed -i -f filters/FiltTiledImageModelDataSmudge.sed

        echo "checking resources.properties"
        find src/ -name 'resources.properties' | xargs sed -i -f filters/FiltResPropClean.sed
        find src/ -name 'resources.properties' | xargs sed -i -f filters/FiltResPropSmudge.sed

        echo "checking web.xml"
        find WEB-INF -name 'web.xml' | xargs sed -i -f filters/FiltWebXmlClean.sed
        find WEB-INF -name 'web.xml' | xargs sed -i -f filters/FiltWebXmlSmudge.sed

        echo "checking google analytics code"
        find jsp/ -name 'ga.jsp' | xargs sed -i -f filters/FiltGoogleAnClean.sed
        find jsp/ -name 'ga.jsp' | xargs sed -i -f filters/FiltGoogleAnSmudge.sed

        echo "checking any direct references to website url is set to the branch site"
        find ./ -name 's*.xml' -or -name '*.jsp' -or -name '*.htm' -or -name '*.html' -or -name '*.js' -or -name '*.owl' -or -name '*.java' -or -name 'log4j.properties' | xargs sed -i -f filters/FiltGenClean.sed
        find ./ -name 's*.xml' -or -name '*.jsp' -or -name '*.htm' -or -name '*.html' -or -name '*.js' -or -name '*.owl' -or -name '*.java' -or -name 'log4j.properties' | xargs sed -i -f filters/FiltGenSmudge.sed

        echo "Recompiling the site..."
        nice ant

        echo "Redeploying ontology server..."
        nice deploy/start-${branch}-Ont-Server.sh

        echo "Done."

    else
        if [ `git diff --name-only $current | grep "\.gz" | wc -l` -gt 0 ]
        then
            nice deploy/decompress.sh
        fi

        echo "recording git branch and version details"
        git describe --long > revision
        echo $branch > branch
        cp /disk/data/VFB/Chado/VFB_DB/current/revision flybase
        head -n 100 resources/fbbt-simple.owl | grep versionIRI | sed 's/^[^"]*"\([^"]*\)".*/\1/' > owldate
        echo "which are:"
        cat branch
        cat revision
        echo "Flybase version:"
        cat flybase
        echo "OWL date:"
        cat owldate
        if [ `git diff --name-only $current | grep "deploy/attributes\|deploy/config" | wc -l` -gt 0 ]
        then
            echo "updating git filters"
            cp deploy/attributes .git/info/
            cp deploy/config .git/
        fi
        if [ `git diff --name-only $current | grep "\.sed" | wc -l` -gt 0 ]
        then
            echo "checking filters to use correct branch names"
            find filters/ -name 'Filt*Smudge.sed' | xargs sed -i -f filters/Local-General-Clean.sed
            find filters/ -name 'Filt*Smudge.sed' | xargs sed -i -f filters/Local-${branch}-Smudge.sed
        fi
        if [ `git diff --name-only $current | grep "tiledImageModelD" | wc -l` -gt 0 ]
        then
            echo "checking image json files"
            find data/flybrain/ -name 'tiledImageModelD*.jso' | xargs sed -i -f filters/FiltTiledImageModelDataClean.sed
            find data/flybrain/ -name 'tiledImageModelD*.jso' | xargs sed -i -f filters/FiltTiledImageModelDataSmudge.sed
        fi
        if [ `git diff --name-only $current | grep "resources.properties" | wc -l` -gt 0 ]
        then
            echo "checking resources.properties"
            find src/ -name 'resources.properties' | xargs sed -i -f filters/FiltResPropClean.sed
            find src/ -name 'resources.properties' | xargs sed -i -f filters/FiltResPropSmudge.sed
        fi
        if [ `git diff --name-only $current | grep "web.xml" | wc -l` -gt 0 ]
        then
            echo "checking web.xml"
            find WEB-INF -name 'web.xml' | xargs sed -i -f filters/FiltWebXmlClean.sed
            find WEB-INF -name 'web.xml' | xargs sed -i -f filters/FiltWebXmlSmudge.sed
        fi
        if [ `git diff --name-only $current | grep "ga.jsp" | wc -l` -gt 0 ]
        then
            echo "checking google analytics code"
            find jsp/ -name 'ga.jsp' | xargs sed -i -f filters/FiltGoogleAnClean.sed
            find jsp/ -name 'ga.jsp' | xargs sed -i -f filters/FiltGoogleAnSmudge.sed
        fi
        if [ `git diff --name-only $current | grep "\.xml\|\.jsp\|\.htm\|\.html\|\.js\|\.owl\|\.java|log4j.properties" | wc -l` -gt 0 ]
        then
            echo "checking any direct references to website url is set to the branch site"
            find ./ -name 's*.xml' -or -name '*.jsp' -or -name '*.htm' -or -name '*.html' -or -name '*.js' -or -name '*.owl' -or -name '*.java' -or -name 'log4j.properties' | xargs sed -i -f filters/FiltGenClean.sed
            find ./ -name 's*.xml' -or -name '*.jsp' -or -name '*.htm' -or -name '*.html' -or -name '*.js' -or -name '*.owl' -or -name '*.java' -or -name 'log4j.properties' | xargs sed -i -f filters/FiltGenSmudge.sed
        fi
        if [ `git diff --name-only $current | grep "src/\|build\.xml" | wc -l` -gt 0 ]
        then
            echo "Recompiling the site..."
            om tomcat stop
            nice ant
            om tomcat start
        fi
        if [ `git diff --name-only $current | grep "\.owl\|deploy/start" | wc -l` -gt 0 ]
        then
            echo "Redeploying ontology server..."
            nice deploy/start-${branch}-Ont-Server.sh
            echo "giving tomcat time to restart..."
            sleep 5m
        fi
        echo "Done."
    fi

else
    echo "Error: Git directory not found! This script should be run in the git base directory e.g. /disk/data/tomcat/fly/webapps/vfb?/"
fi
