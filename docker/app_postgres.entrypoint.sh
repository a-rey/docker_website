#!/usr/bin/env bash

echo "[postgres][app-entrypoint.sh] user: $(id)"
echo "[postgres][app-entrypoint.sh] starting postgreSQL server ..."
# call parent image docker-entrypoint.sh to do the hard work:
# https://github.com/docker-library/postgres/blob/master/docker-entrypoint.sh
/bin/bash /docker-entrypoint.sh
