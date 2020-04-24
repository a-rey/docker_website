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

## Development Notes:

### Host Setup:

- [Ubuntu 18.04 LTS amd64 ISO download](https://ubuntu.com/download/server/thank-you?version=18.04.4&architecture=amd64)

- [Docker CE Install](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

- [Docker Compose Install](https://docs.docker.com/compose/install/)

- Install Python3.7 and pipenv

  ```bash
  sudo apt-get update && sudo apt-get upgrade
  sudo apt-get install -y python3.7 python3-pip
  python3.7 -m pip install --user pipenv
  echo 'export PATH="${HOME}/.local/bin:$PATH"' >> ~/.bashrc
  source ~/.bashrc
  ```

- Install Django dependencies

  ```bash
  sudo apt-get install -y python3.7-dev libpq-dev # psycopg2 build dependencies 
  pipenv install
  ```

- Remove Ubuntu snapd

  ```bash
  sudo apt autoremove --purge snapd gnome-software-plugin-snap
  sudo rm -rf /var/cache/snapd/
  rm -fr ~/snap
  ```

### Development Workflow Overview:

```bash
pipenv shell                                       # start virtualenv shell
cd django                                          # enter project directory
find . -name \*.pyc -delete                        # remove old Python bytecode
rm -rf dev-*                                       # remove old dev files
export DJANGO_SETTINGS_MODULE=settings.development # set django settings module
printf 'yes' | python manage.py collectstatic      # recollect static files 
python manage.py migrate                           # setup database schema
python manage.py runserver 0.0.0.0:8000            # spin up django app
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# MISC development commands
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
python manage.py createsuperuser          # add test admin user to database
python manage.py loaddata app_whoami.json # load fixture JSON (takes a while)
python manage.py flush                    # drop all data in each DB table
```

### MaxMind GeoIP Database Management Notes:

- MaxMind account creation:

  - [Create a GeoIP lite account](https://www.maxmind.com/en/geolite2/signup)
  - [Reset the password on the new account so you can login](https://www.maxmind.com/en/account/forgot-password)

- Generating a new MaxMind license key:

  - [Login in](https://www.maxmind.com/en/account/login) and browse to Services > My License Key 
  - Create a new license key and save the key to `secrets/geoip.key`

- Getting GeoIP Lite direct download URLs:

  - Browse to Account Summary > Download Databases
  - Copy permalinks for needed CSV formatted database files 
  - Update the `URLS` variable in `django/app_whoami/fixtures/update.py` as needed

- Updating django JSON fixture file `app_whoami.json`:

  ```bash
  pipenv shell                              # start virtualenv shell
  cd django/app_whoami/fixtures             # enter fixtures directory
  ./update.py -k ../../../secrets/geoip.key # generate new JSON fixture
  ```

- Loading django JSON fixture `app_whoami.json` into DB:

  - Connect to the DB:

    ```bash
    pipenv shell             # start virtualenv shell
    cd django                # enter project directory
    python manage.py dbshell # start a DB SQL shell
    ```

  - **[DEVELOPMENT]** remove old table data:

    ```sql
    SELECT name FROM sqlite_master WHERE name LIKE '%whoami%'; -- get app tables
    DELETE FROM <table_name>;                                  -- drop table data
    ```

  - **[PRODUCTION]** remove old table data:

    ```sql
    TODO
    ```

  - Import new fixture into DB:

    ```bash
    python manage.py loaddata app_whoami.json # load fixture JSON (takes a while)
    ```

## Application Secrets

- `geoip.key`: MaxMind account license key for GeoIPLite2 database offline downloads
- `???`

## Resources:

- [nginx admin handbook](https://github.com/trimstray/nginx-admins-handbook)

