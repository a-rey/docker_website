# https://pythonspeed.com/articles/base-image-python-docker-images/
FROM python:3.11-slim

# https://docs.python.org/3/using/cmdline.html#cmdoption-u
ENV PYTHONUNBUFFERED 1
# https://docs.python.org/3/using/cmdline.html#id1
ENV PYTHONDONTWRITEBYTECODE 1

# local image user ID and group ID to not run as root
ENV USER_UID 6969
ENV USER_GID 6969

# add application code to image
COPY ./docker/app_django.entrypoint.sh /app-entrypoint.sh
COPY ./django /app

RUN \
    # update system packages
       apt-get update \
    # install image dependencies:
    # - libpq-dev & build-essential are for psycopg2 (Python postgresql)
    # - postgresql-client is for the psql utility to connect to postgreSQL DB
    && apt-get install -y --no-install-recommends \
          libpq-dev \
          build-essential \
          postgresql-client \
    # install application Python dependencies
    && python3 -m pip install --upgrade pip \
    && python3 -m pip install --no-cache-dir pipenv \
    && cd /app \
    && pipenv lock --verbose \
    && pipenv install --system --deploy --verbose \
    && pipenv --rm --clear \
    && python3 -m pip uninstall -y pipenv \
    # make entry executable
    && chmod +x /app-entrypoint.sh \
    # create image user and chown files
    && groupadd -g $USER_GID app_django \
    && useradd --no-log-init -r -u $USER_UID -g $USER_GID app_django \
    # make expected volume mounts and files
    && mkdir -p /app/__staticfiles \
    # chown image mounts and files
    && chown -R ${USER_GID}:${USER_GID} /app \
    # layer cleanup
    && apt-get purge -y --auto-remove \
          build-essential \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf \
          /tmp/* \
          ~/.cache/ \
          /var/tmp/* \
          /var/lib/apt/lists/*

# define application volume for Django static files
VOLUME ["/app/__staticfiles"]

USER app_django

ENTRYPOINT ["/app-entrypoint.sh"]
