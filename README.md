# Django server with DB backend on Heroku

My personal Django server running on heroku that I use in personal projects as a backend

## Apps

- `whoami` Parses client request headers and returns them in JSON with a GeoIP lookup using [MaxMind](https://dev.maxmind.com/geoip/geoip2/geolite2/) databases.

## Development Notes

- build python virtual environment (may need to update `requirements.txt` software versions too):
```
rm -rf env/
pip install virtualenv --upgrade
virtualenv env
source env/bin/activate
pip install -r requirements.txt
```
- run dev server: `./dev.sh`
- exit virtual environment: `deactivate`

## Deployment

- update heroku CLI: `brew update && brew upgrade`
- clean repo: `./dev.sh clean`
- push code to heroku linked github repo
- login to heroku: `heroku login`
- login to [heroku](https://dashboard.heroku.com/apps/aaronmreyes/deploy/github) and manually deploy application
- drop current heroku DB: `heroku run --app aaronmreyes python manage.py flush`
- migrate heroku database: `heroku run --app aaronmreyes python manage.py migrate`
- install fixtures for whoami geoip database: `heroku run --app aaronmreyes "for i in whoami/fixtures/*.json; do python manage.py loaddata \$i; done"`
- create a superuser: `heroku run --app aaronmreyes python manage.py createsuperuser`
