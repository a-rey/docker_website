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

## Host Setup:

- [Ubuntu 18.04 LTS amd64 ISO download](https://ubuntu.com/download/server/thank-you?version=18.04.4&architecture=amd64)
- [Docker CE Install](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [Docker Compose Install](https://docs.docker.com/compose/install/)
- Install Python3.7 and [pipenv](https://pipenv.pypa.io/en/latest/):

  ```bash
  sudo apt-get update && sudo apt-get upgrade
  sudo apt-get install -y python3.7 python3-pip
  python3.7 -m pip install --user pipenv
  echo 'export PATH="${HOME}/.local/bin:$PATH"' >> ~/.bashrc
  source ~/.bashrc
  ```

- Install Django application dependencies:

  ```bash
  sudo apt-get install -y \
  	libpq-dev \
    python3.7-dev \
    build-essential \
    python3-setuptools # psycopg2 (Python postgresql) dependencies 
  cd django && pipenv install --dev
  ```

- Remove Ubuntu snapd:

  ```bash
  sudo apt autoremove --purge snapd gnome-software-plugin-snap
  sudo rm -rf /var/cache/snapd/
  rm -fr ~/snap
  ```

## Django Application Development Notes:

```bash
export DJANGO_SETTINGS_MODULE=settings.development # set django settings module
cd django                                          # enter project directory
pipenv shell                                       # start virtualenv shell
rm -rf __dev-*                                     # remove old dev files
python manage.py collectstatic --no-input          # recollect static files 
python manage.py migrate                           # setup database schema
python manage.py runserver 0.0.0.0:8000            # spin up django app
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# MISC development commands
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
python manage.py createsuperuser          # add test admin user to database
python manage.py loaddata app_whoami.json # load JSON fixture (takes a while)
python manage.py flush                    # drop all data in each DB table
exit                                      # exit virtual environment
```

## MaxMind GeoIP Database Management Notes:

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
  cd django                                 # enter project directory
  pipenv shell                              # start virtualenv shell
  cd app_whoami/fixtures                    # enter fixtures directory
  ./update.py -k ../../../secrets/geoip.key # generate new JSON fixture
  ```

- Loading Django JSON fixture `app_whoami.json` into DB:

  - **DEVELOPMENT:**

    - Connect to the DB:

      ```bash
      cd django                # enter project directory
      pipenv shell             # start virtualenv shell
      python manage.py dbshell # start a DB SQL shell
      ```

    - _-- If Django DB schema has **not** changed --_ remove old table data:

      ```mysql
      SELECT name FROM sqlite_master WHERE name LIKE '%whoami%'; -- get app tables
      DELETE FROM <table_name>;                                  -- drop table data
      .exit                                                      -- exit db connection
      ```

    - _-- If Django DB schema **has** changed --_ delete tables:

      ```mysql
      SELECT name FROM sqlite_master WHERE name LIKE '%whoami%'; -- get app tables
      DROP TABLE <table_name>;                                   -- drop table
      .exit                                                      -- exit db connection
      ```

    - Import the new fixtures:

      ```bash
      python manage.py migrate                  # re-create any broken tables
      python manage.py loaddata app_whoami.json # load JSON fixture (takes a while)
      exit                                      # exit virtual environment
      ```

  - **PRODUCTION:** 

    ```sql
    TODO
    ```

## Production Notes:

- Build django application image:

  ```bash
  sudo systemctl stop web                                # stop application if running
  sudo docker rmi --force app:latest                     # delete old app image
  sudo docker build --tag app -f docker/app.Dockerfile . # rebuild image
  ```

- Install docker-compose service:

  - Create a `/etc/systemd/system/web.service` file with the following content:

    - **NOTE:** replace `<path to docker-compose.yml>` below with host system's path

    ```bash
    [Unit]
    Description=Docker Compose App Service
    Requires=docker.service
    After=docker.service
    
    [Service]
    Type=oneshot
    RemainAfterExit=yes
    ExecStart=/usr/local/bin/docker-compose -f <path to docker-compose.yml> up -d
    ExecStop=/usr/local/bin/docker-compose -f <path to docker-compose.yml> down
    TimeoutStartSec=0
    
    [Install]
    WantedBy=multi-user.target
    ```

  - Install the service:

    ```bash
    sudo systemctl enable web
    ```

    

  

- Helpful debugging commands:

  ```bash
  # spawn a bash shell in Django application container
  sudo docker run -it --entrypoint /bin/bash --env-file secrets/app.env app -s
  ```

  



## Application Secrets:

- `geoip.key`: MaxMind account license key for GeoIPLite2 database offline downloads
- `app.env`: Django application environmental variables
  - `DJANGO_SETTINGS_MODULE`: [variable documentation](https://docs.djangoproject.com/en/dev/topics/settings/#envvar-DJANGO_SETTINGS_MODULE)
  - `GUNICORN_ARGS`: [variable documentation](https://docs.gunicorn.org/en/latest/settings.html#settings)
  - 

## Resources:

- [nginx admin handbook](https://github.com/trimstray/nginx-admins-handbook)

