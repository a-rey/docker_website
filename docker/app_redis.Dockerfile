# https://github.com/docker-library/redis/blob/master/Dockerfile.template
# --> parent image already creates non-root user 'redis' with a VOLUME
#     so we use have to use that user ...
FROM redis:latest

# add application code to image
COPY ./docker/app_redis.entrypoint.sh /app-entrypoint.sh
COPY ./secrets/redis.secrets.conf /redis.secrets.conf
COPY ./docker/redis.conf /redis.conf

RUN \
    # make entry executable
       chmod +x /app-entrypoint.sh \
    # chown image mounts and files
    && chown -R redis:redis /redis.secrets.conf \
    && chown -R redis:redis /redis.conf

USER redis

ENTRYPOINT ["/app-entrypoint.sh"]
