#! /bin/bash

echo "Installing grunt-cli and bower"
npm install -g grunt-cli bower
npm list --depth=0
echo "Installing bower components"
bower install

echo "Starting build"
grunt build -f


echo "Changing Directory to ./dist"
cd dist

echo "Setting git config user.email and user.name"
git config --global user.email "manjesh@quetzal.in"
git config --global user.name "Manjesh V"

echo "Git Init"
git init

echo "Adding remote"
git remote add dokku dokku@cloud.quezx.com:api

echo "Pulling from dokku"
git pull origin master

echo "Adding files to git"
git add *

echo "Commiting..."
git commit -m "new"

echo "Started deploying"
git push dokku master --force

echo "Deployed Successfully!"
exit 0
