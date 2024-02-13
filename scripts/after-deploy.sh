#!/bin/bash
REPOSITORY=/home/ec2-user/build

cd $REPOSITORY

/usr/bin/yarn
/usr/bin/yarn migrate
/usr/bin/pm2 start yarn --name "wave" -- start