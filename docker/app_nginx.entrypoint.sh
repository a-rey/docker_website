#!/usr/bin/env bash

trap exit TERM;
echo "[nginx][app-entrypoint.sh] user: $(id)"

# check if a TLS cert needs to be generated
if [[ ! -f /etc/letsencrypt/live/${CERT_DOMAIN}/fullchain.pem && ! -f /etc/letsencrypt/live/${CERT_DOMAIN}/privkey.pem ]]; then
  echo "[nginx][app-entrypoint.sh] TLS certificates not found for ${CERT_DOMAIN}"
  # run nginx with a temp config to pass ACME validation
  cat > /tmp/temp.conf << EOL
daemon off;
http {
  server {
    listen      0.0.0.0:8080;
    server_name ${CERT_DOMAIN};
    location /.well-known/acme-challenge/ {
      root /__certbot/;
    }
    # close connection without response
    return 444;
  }
}
EOL
  echo "[nginx][app-entrypoint.sh] running temp nginx server to pass ACME validation ..."
  sudo -u app_nginx /bin/bash -c "nginx -c /tmp/temp.conf &"
  TEMP_PID=$!
  echo "[nginx][app-entrypoint.sh] requesting **new** TLS certificates for ${CERT_DOMAIN} ..."
  certbot certonly --webroot \
    ${CERT_TEST_FLAGS} \
    --webroot-path /__certbot \
    --email ${CERT_EMAIL} \
    --rsa-key-size ${CERT_RSA_KEY_SIZE} \
    --agree-tos \
    --force-renewal \
    -d ${CERT_DOMAIN}
  kill -9 $TEMP_PID
  rm -f /tmp/temp.conf
fi

# start nginx and certbot background update loop
while :;
do
  echo "[nginx][app-entrypoint.sh] waiting ${CERT_RENEW_DELAY} until certificate renewal ..."
  sleep ${CERT_RENEW_DELAY} & wait $!;
  echo "[nginx][app-entrypoint.sh] renewing ${CERT_DOMAIN} ..."
  certbot ${CERT_TEST} renew;
  echo "[nginx][app-entrypoint.sh] reloading nginx configuration ..."
  sudo -u app_nginx /bin/bash -c "nginx -s reload"
done &

echo "[nginx][app-entrypoint.sh] starting nginx server ..."
sudo -u app_nginx /bin/bash -c "nginx"
