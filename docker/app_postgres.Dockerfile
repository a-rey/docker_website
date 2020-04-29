# https://github.com/docker-library/postgres/blob/master/Dockerfile-debian.template
# --> parent image already creates non-root user 'postgres' with a VOLUME
#     so we use have to use that user ...
FROM postgres:latest

# add application code to image
COPY ./docker/app_postgres.entrypoint.sh /app-entrypoint.sh

RUN \
    # make entry executable
    chmod +x /app-entrypoint.sh

USER postgres

ENTRYPOINT ['/app-entrypoint.sh']
