#! /bin/bash

docker stop restapi

docker rm restapi

docker build . -t nodejs-rest

docker run -e VERSION=1.1 --name restapi -p 3000:3000 nodejs-rest