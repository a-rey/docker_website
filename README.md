#  Docker Django Server

My personal dockerized django server that I use in personal projects as a backend.

## Architecture Notes:

<<<<<<< HEAD
![Architecture](./docs/architecture.png)

- [Nginx](https://www.nginx.com/):
  - Acts as a fast and lightweight [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy)
  - Provides HTTPS support through [Let's Encrypt](https://letsencrypt.org/) for free
  - Serves django application static files (no need for [WhiteNoise](http://whitenoise.evans.io/en/stable/))
- [Gunicorn](https://gunicorn.org/)
  - Python [WSGI](https://en.wikipedia.org/wiki/Web_Server_Gateway_Interface) HTTP Server for UNIX
  - Manages django application thread pool
- [PostgreSQL](https://www.postgresql.org/)
  - SQL compliant database with django community support
- [Redis](https://redis.io/)
  - PostgreSQL request caching through django for UNIX
=======
- `aaronmreyes` Personal website https://www.aaronmreyes.com.
- `whois` GeoIP lookup using [MaxMind](https://dev.maxmind.com/geoip/geoip2/geolite2/) databases.

## TODO

- add HSTS header to server config
- add more programs to `aaronmreyes`

## Development Notes
>>>>>>> d1c90612f85aefaf9b0280d63e547f0f044d35a3

TODO: `requirements.base` listing

TODO: `docker-compose.yml` listing

## Development Notes:

### [1] Environment Setup:

- [Ubuntu 18.04 LTS amd64 ISO download](https://ubuntu.com/download/server/thank-you?version=18.04.4&architecture=amd64)
- [Docker CE Install](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [Docker Compose Install](https://docs.docker.com/compose/install/)
- Python3.8 and [pipenv](https://pipenv-fork.readthedocs.io/) install:

```bash
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install python3.8 python3-pip
python3.8 -m pip install --user pipenv
echo 'export PATH="${HOME}/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## Resources:

<<<<<<< HEAD
- [nginx admin handbook](https://github.com/trimstray/nginx-admins-handbook)
=======
```bash
brew update && brew upgrade  # update heroku CLI if needed
source env/bin/activate
./dev.sh clean               # clean repo and push code to github
# login to heroku to manually deploy application:
# https://dashboard.heroku.com/apps/aaronmreyes/deploy/github
#############################################
# Updating fixtures for GeoIP database
#############################################
heroku login
heroku run --app aaronmreyes python manage.py flush
heroku run --app aaronmreyes python manage.py migrate
heroku run --app aaronmreyes "for i in whois/fixtures/*.json; do python manage.py loaddata \$i; done"
heroku run --app aaronmreyes python manage.py createsuperuser
```
>>>>>>> d1c90612f85aefaf9b0280d63e547f0f044d35a3
