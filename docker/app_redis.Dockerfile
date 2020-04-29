FROM redis:latest

# local image user ID and group ID to not run as root
ENV USER_UID 1337
ENV USER_GID 1337

# add application code to image
COPY ./docker/app_redis.entrypoint.sh /app-entrypoint.sh
COPY ./secrets/redis.secrets.conf /redis.secrets.conf
COPY ./docker/redis.conf /redis.conf

RUN \
    # make expected volume mounts and files
       mkdir -p /data \
    # make entry executable
    && chmod +x /app-entrypoint.sh \
    # create image user
    && groupadd -g $USER_GID _user \
    && useradd --no-log-init -r -u $USER_UID -g $USER_GID _user \
    # chown image mounts and files
    && chown -R ${USER_GID}:${USER_GID} /data \
    && chown -R ${USER_GID}:${USER_GID} /redis.secrets.conf \
    && chown -R ${USER_GID}:${USER_GID} /redis.conf

USER _user

ENTRYPOINT ['/app-entrypoint.sh']
