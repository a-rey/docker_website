# https://pythonspeed.com/articles/base-image-python-docker-images/
FROM python:3.7-slim-buster

# https://docs.python.org/3/using/cmdline.html#cmdoption-u
ENV PYTHONUNBUFFERED 1
# https://docs.python.org/3/using/cmdline.html#id1
ENV PYTHONDONTWRITEBYTECODE 1

# add application code to container
COPY ./docker/app.docker-entrypoint.sh /docker-entrypoint.sh
COPY ./django /app

RUN \
    # update system packages
       apt-get update \
    # install python package build dependencies
    && apt-get install -y --no-install-recommends \
          libpq-dev \
          build-essential \
    # install application Python dependencies
    && python3.7 -m pip install --no-cache-dir pipenv \
    && cd /app \
    && pipenv lock -r > requirements.txt \
    && pipenv --rm --clear \
    && python3.7 -m pip uninstall -y pipenv \
    && python3.7 -m pip install --no-cache-dir -r requirements.txt \
    # make entry executable
    && chmod +x /docker-entrypoint.sh \
    # create app user and chown app files
    && groupadd app \
    && useradd --no-log-init -r -g app app \
    && chown -R app:app /app \
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

WORKDIR /app

USER app

ENTRYPOINT ["/docker-entrypoint.sh"]
