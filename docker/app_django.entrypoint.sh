#!/usr/bin/env bash

echo "[django][app-entrypoint.sh] user: $(id)"
cd /app
echo "[django][app-entrypoint.sh] running django migrations ..."
python3 manage.py migrate
echo "[django][app-entrypoint.sh] collecting django static files ..."
python3 manage.py collectstatic --no-input
echo "[django][app-entrypoint.sh] starting gunicorn WSGI server ..."
gunicorn --workers=8 --bind=0.0.0.0:8000 --worker-class=sync --log-level debug --log-file - wsgi
