#!/bin/bash
REPOSITORY=/home/ec2-user/build

cd $REPOSITORY

sudo /usr/bin/yarn
sudo /usr/bin/yarn migrate
sudo /usr/bin/pm2 start yarn --name "wave" -- start