# https://github.com/docker-library/postgres/blob/master/Dockerfile-debian.template
# --> parent image already creates non-root user 'postgres' with a VOLUME
#     so we use have to use that user ...
FROM postgres:latest

# use parent image ENTRYPOINT (no need for a seperate app-entrypoint.sh)
USER postgres
