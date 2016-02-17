#! /bin/bash

echo "Installing grunt-cli and bower"
npm install -g grunt-cli bower

echo "Starting build"
grunt


echo "Changing Directory to ./dist"
cd dist

echo "Setting git config user.email and user.name"
git config --global user.email "manjesh@quetzal.in"
git config --global user.name "Manjesh V"

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
