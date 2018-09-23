# Django server with DB backend on Heroku

My personal Django server running on heroku that I use in personal projects as a backend

## Apps

- `aaronmreyes` Personal website https://www.aaronmreyes.com.
- `whois` GeoIP lookup using [MaxMind](https://dev.maxmind.com/geoip/geoip2/geolite2/) databases.

## TODO

- add HSTS header to server config
- add more programs to `aaronmreyes`

## Development Notes

May need to update `requirements.txt` software versions if they are out of date.

```bash
rm -rf env/                               # remove old virtual environment
pip install virtualenv --upgrade          # update virtual environment
virtualenv env                            # build virtual environment
source env/bin/activate                   # start virtual environment
pip install -r requirements.txt           # install application dependencies
python whois/fixtures/update_fixtures.py  # update GeoIP database fixtures
./dev.sh                                  # run dev server
deactivate                                # exit virtual environment
```

## Deployment Notes

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
