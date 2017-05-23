#!/usr/bin/env bash
cd /home/deploy/surfboard
docker-compose stop
docker system prune -af
docker-compose pull
docker-compose up -d