#!/usr/bin/env bash
export NODE_ENV=production

cd /home/deploy/surfboard
git checkout master
git branch | grep -v "master" | xargs git branch -D
git fetch origin pull/$TRAVIS_PULL_REQUEST/head:$TRAVIS_PULL_REQUEST
git checkout $TRAVIS_PULL_REQUEST
cp /home/deploy/production.js /home/deploy/surfboard/config/production.js
rm -R node_modules
npm install
npm build