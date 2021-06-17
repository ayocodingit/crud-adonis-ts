#!/bin/sh

cd ./build

npm ci --production

node server.js
