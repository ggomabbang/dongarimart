#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" 

REPOSITORY=/home/ec2-user/build

cd $REPOSITORY

npm i
npm run migrate
npm run generate
pm2 start "npm run start" --name "next"