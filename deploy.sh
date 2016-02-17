#! /bin/bash

echo "Changing Directory"
cd dist

echo "Git Init"
git init

echo "Adding files to git"
git add *

echo "Commiting..."
git commit -m "new"

echo "added remote"
git remote add dokku dokku@cloude.quezx.com:partner

echo "Started deploying"
git push dokku master

echo "Deployed Successfully!"
exit 0
