#!/usr/bin/env bash

echo "[nginx][app-entrypoint.sh] user: $(id)"
echo "[nginx][app-entrypoint.sh] starting nginx server ..."
nginx -g "daemon off;"
