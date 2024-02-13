#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" 

REPOSITORY=/home/ec2-user/build

cd $REPOSITORY
pwd

yarn
yarn migrate
pm2 start yarn --name "wave" -- start