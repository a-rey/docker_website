FROM postgres:latest

# local image user ID and group ID to not run as root
ENV USER_UID 10101
ENV USER_GID 10101

# add application code to image
COPY ./docker/app_postgres.entrypoint.sh /app-entrypoint.sh

RUN \
    # make entry executable
       chmod +x /app-entrypoint.sh \
    # create image user
    && groupadd -g $USER_GID _user \
    && useradd --no-log-init -r -u $USER_UID -g $USER_GID _user \
    # chown image mounts and files
    && chown -R ${USER_GID}:${USER_GID} /usr/share/postgresql \
    && chown -R ${USER_GID}:${USER_GID} /var/run/postgresql \
    && chown -R ${USER_GID}:${USER_GID} /var/lib/postgresql

USER _user

ENTRYPOINT ['/app-entrypoint.sh']
