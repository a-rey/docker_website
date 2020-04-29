#!/usr/bin/env bash

echo "[redis][app-entrypoint.sh] user: $(id)"
echo "[redis][app-entrypoint.sh] starting redis server ..."
redis-server /redis.conf
