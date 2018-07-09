# Django server with DB backend on Heroku

My personal Django server running on heroku that I use in personal projects as a backend

## Apps

- `whoami` Parses client request headers and returns them in JSON with a GeoIP lookup using [MaxMind](https://dev.maxmind.com/geoip/legacy/geolite/) databases.

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
- login to heroku: `heroku login`
- push code to heroku linked github repo: `git add --all`
