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
    # install certbot (https://certbot.eff.org/lets-encrypt/debianbuster-nginx)
    && apt-get install -y --no-install-recommends\
          curl \
          certbot \
          python-certbot-nginx \
    # make expected static file volume mounts and nginx files
    && mkdir -p /__certbot \
    && mkdir -p /__staticfiles \
    && mkdir -p /var/lib/letsencrypt \
    && mkdir -p /var/log/letsencrypt \
    && mkdir -p /etc/letsencrypt \
    # download RFC7919 TLS DH parameters (https://tools.ietf.org/html/rfc7919#appendix-A)
    && curl https://ssl-config.mozilla.org/ffdhe2048.txt > /etc/nginx/ffdhe2048.pem \
    # make entry executable
    && chmod +x /app-entrypoint.sh \
    # create image user
    && groupadd -g $USER_GID app_nginx \
    && useradd --no-log-init -r -u $USER_UID -g $USER_GID app_nginx \
    # chown image mounts and files
    && chown -R ${USER_GID}:${USER_GID} /__certbot \
    && chown -R ${USER_GID}:${USER_GID} /__staticfiles \
    && chown -R ${USER_GID}:${USER_GID} /var/cache/nginx \
    && chown -R ${USER_GID}:${USER_GID} /var/log/nginx \
    && chown -R ${USER_GID}:${USER_GID} /etc/nginx/ \
    && chown -R ${USER_GID}:${USER_GID} /var/lib/letsencrypt \
    && chown -R ${USER_GID}:${USER_GID} /var/log/letsencrypt \
    && chown -R ${USER_GID}:${USER_GID} /etc/letsencrypt \
    # layer cleanup
    && apt-get purge -y --auto-remove \
          curl \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf \
          /tmp/* \
          /var/tmp/* \
          /var/lib/apt/lists/*


# define application volume for Django and letsEncrypt certbot files
VOLUME ["/__staticfiles","/etc/letsencrypt/"]

USER app_nginx

ENTRYPOINT ["/app-entrypoint.sh"]
