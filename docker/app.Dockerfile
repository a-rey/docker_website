FROM ubuntu:bionic

# https://docs.python.org/3/using/cmdline.html#cmdoption-u
ENV PYTHONUNBUFFERED 1
# https://docs.python.org/3/using/cmdline.html#id1
ENV PYTHONDONTWRITEBYTECODE 1

# add application code into container
COPY ./docker/app.docker-entrypoint.sh /docker-entrypoint.sh
COPY ./django /app

RUN \
    # update system packages
       apt-get update \
    # install system python packages
    && apt-get install -y --no-install-recommends \
          libpq-dev \
          python3.7 \
          python3-pip \
          python3.7-dev \
          build-essential \
          python3-setuptools \
    # install application Python dependencies
    && python3.7 -m pip install --no-cache-dir pipenv \
    && cd /app \
    && pipenv lock -r > requirements.txt \
    && pipenv --rm \
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
          libpq-dev \
          python3-pip \
          python3.7-dev \
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
