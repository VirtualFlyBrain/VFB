#!/bin/bash
#To be run after deployment script only
if [ $branch ]
then
  echo "Adding git Smudge/Clean filters..."
  for file in filters/Filt*Smudge.sed
  do
    sed -f filters/Local-General-Clean.sed $file
    sed -f filters/Local-${branch}-Smudge.sed $file
  done
  cp deploy/config .git/
  if [ ! -d .git/info ]
  then
      mkdir .git/info
  fi
  cp deploy/attributes .git/info/
  sed -i s/BRANCH_NAME/${branch}/g .git/config
else
  echo "To be run after deployment script only!"
fi
