#  Docker Django Server

A dockerized django server that I use in personal projects as a backend.

## Architecture Notes:

_NOTE:_ diagram made with https://draw.io

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

TODO: `requirements.base` listing

TODO: `docker-compose.yml` listing

## Development Notes:

### [1] Host Setup:

- [Ubuntu 18.04 LTS amd64 ISO download](https://ubuntu.com/download/server/thank-you?version=18.04.4&architecture=amd64)
- [Docker CE Install](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [Docker Compose Install](https://docs.docker.com/compose/install/)

```bash
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# install Python3.7 and pipenv
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
pipenv & Python dependencies
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install python3.7 python3-pip
python3.7 -m pip install --user pipenv
echo 'export PATH="${HOME}/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# install django dependencies
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
sudo apt-get install python3.7-dev libpq-dev # psycopg2 build dependencies 
pipenv install
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# remove snapd
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
sudo rm -rf /var/cache/snapd/
sudo apt autoremove --purge snapd gnome-software-plugin-snap
rm -fr ~/snap
```

### [2] Workflow:

```bash
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# development
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
pipenv shell                                       # start virtual environment shell
cd django                                          # enter project directory
find . -name \*.pyc -delete                        # remove old pyhton bytecode files
rm -rf staticfiles                                 # remove old static files 
rm -f db.sqlite3                                   # remove old development database
export DJANGO_SETTINGS_MODULE=settings.development # set target django settings module
printf 'yes' | python manage.py collectstatic      # recollect static files 
python manage.py migrate                           # setup database schema
python manage.py createsuperuser                   # add test admin user to database
python manage.py runserver 0.0.0.0:8000            # spin up django app
```

## Resources:

- [nginx admin handbook](https://github.com/trimstray/nginx-admins-handbook)