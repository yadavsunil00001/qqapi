#! /bin/bash
cd dist
git init
git add *
git commit -m "new"
git remote add dokku dokku@cloude.quezx.com:partner
git push dokku master
