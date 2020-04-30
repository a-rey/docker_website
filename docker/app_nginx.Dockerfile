# https://www.rockyourcode.com/run-docker-nginx-as-non-root-user/
FROM nginx:latest

# local image user ID and group ID to not run as root
# NOTE: must match app_django.Dockerfile for shared static file storage
ENV USER_UID 6969
ENV USER_GID 6969

# add application code to image
COPY ./docker/app_nginx.entrypoint.sh /app-entrypoint.sh
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

RUN \
    # update system packages
       apt-get update \
    # install certbot (https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx)
    && apt-get install -y --no-install-recommends \
          sudo \
          software-properties-common \
    && add-apt-repository universe \
    && add-apt-repository ppa:certbot/certbot \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
          certbot python3-certbot-nginx \
    # make expected static file volume mounts and nginx files
    && mkdir -p /{__certbot,__staticfiles} \
    && touch /var/run/nginx.pid \
    # make entry executable
    && chmod +x /app-entrypoint.sh \
    # create image user
    && groupadd -g $USER_GID app_nginx \
    && useradd --no-log-init -r -u $USER_UID -g $USER_GID app_nginx \
    # chown image mounts and files
    && chown -R ${USER_GID}:${USER_GID} /__certbot \
    && chown -R ${USER_GID}:${USER_GID} /__staticfiles \
    && chown -R ${USER_GID}:${USER_GID} /var/cache/nginx \
    && chown -R ${USER_GID}:${USER_GID} /etc/nginx/ \
    && chown -R ${USER_GID}:${USER_GID} /var/run/nginx.pid

# define application volume for Django and letsEncrypt certbot files
VOLUME ["/__staticfiles","/etc/letsencrypt/"]

# !!! start entrypoint as root
ENTRYPOINT ["/app-entrypoint.sh"]
