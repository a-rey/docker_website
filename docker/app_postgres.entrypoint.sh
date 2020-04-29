#!/usr/bin/env bash

echo "[postgres][app-entrypoint.sh] user: $(id)"
echo "[postgres][app-entrypoint.sh] starting postgreSQL server ..."
# call parent image docker-entrypoint.sh to init the DB:
# https://github.com/docker-library/postgres/blob/master/Dockerfile-debian.template
docker-entrypoint.sh
