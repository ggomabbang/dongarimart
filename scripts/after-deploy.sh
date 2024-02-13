#!/bin/bash
REPOSITORY=/home/ec2-user/build

cd $REPOSITORY

yarn
yarn migrate
pm2 start yarn --name "wave" -- start