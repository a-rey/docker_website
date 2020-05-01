#!/usr/bin/env bash

trap exit TERM;
echo "[nginx][app-entrypoint.sh] user: $(id)"

# check if a **new** TLS cert needs to be generated
if [[ ! -f /etc/letsencrypt/live/${CERT_DOMAIN}/fullchain.pem && ! -f /etc/letsencrypt/live/${CERT_DOMAIN}/privkey.pem ]]; then
  echo "[nginx][app-entrypoint.sh] !!! TLS certificates not found for ${CERT_DOMAIN}"
  # run nginx with a temp configuration to pass initial ACME validation
  cat > /tmp/temp.conf << EOL
pid /tmp/nginx.pid;
events {
}
http {
  server {
    listen      0.0.0.0:8080;
    server_name arey.dev;
    location /.well-known/acme-challenge/ {
      root /__certbot/;
    }
    location / {
      return 444;
    }
  }
}
EOL
  echo "[nginx][app-entrypoint.sh] running temporary nginx server to pass ACME validation ..."
  nginx -c /tmp/temp.conf
  echo "[nginx][app-entrypoint.sh] !!! requesting **new** TLS certificates for ${CERT_DOMAIN} ..."
  certbot certonly --webroot \
    ${CERT_CREATE_FLAGS} \
    --webroot-path /__certbot \
    --email ${CERT_EMAIL} \
    --rsa-key-size ${CERT_RSA_KEY_SIZE} \
    --agree-tos \
    --force-renewal \
    -d ${CERT_DOMAIN}
  nginx -c /tmp/temp.conf -s stop
  rm -f /tmp/temp.conf /tmp/nginx.pid
fi

# start nginx and certbot background update loop
while :;
do
  echo "[nginx][app-entrypoint.sh] waiting ${CERT_RENEW_DELAY} until certificate renewal ..."
  sleep ${CERT_RENEW_DELAY} & wait $!;
  echo "[nginx][app-entrypoint.sh] !!! renewing ${CERT_DOMAIN} ..."
  certbot ${CERT_RENEW_FLAGS} renew --cert-name ${CERT_DOMAIN};
  echo "[nginx][app-entrypoint.sh] reloading nginx configuration ..."
  nginx -s reload;
done &

echo "[nginx][app-entrypoint.sh] starting nginx server ..."
nginx
