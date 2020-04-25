#!/bin/bash

echo "[APP][docker-entrypoint.sh] starting ..."
echo "[APP][docker-entrypoint.sh] app user: $(id)"
cd /app
echo "[APP][docker-entrypoint.sh] running app migrations ..."
python3.7 manage.py migrate
echo "[APP][docker-entrypoint.sh] collecting app static files ..."
python3.7 manage.py collectstatic --no-input
echo "[APP][docker-entrypoint.sh] starting gunicorn WSGI server ..."
gunicorn $GUNICORN_ARGS wsgi
