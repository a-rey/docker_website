# Django server with DB backend on Heroku

My personal Django server running on heroku that I use in personal projects as a web backend

## Apps

- `pixels` ...
- `whoami` Parses client request headers and returns them in JSON

## Development

- clone repo and setup virtual env:
```
virtualenv env
source env/bin/activate
pip install -r requirements.txt
```
- run dev server: `./dev.sh`

## Deployment

- clean repo: `./dev.sh clean`
- push code to github repo

## tips

- exit virtual environment: `deactivate`
- login to heroku: `heroku login`
- update heroku CLI: `brew update && brew upgrade`

## TODO:

#### pixels
- add syntax highlighting for python for a browser text editor? (maybe make a portable version of this?)
- set code editing form to fit the screen height correctly
  - setting height attribute in style of textarea only adjusts to the number of rows given
  - need a way to count the number of lines in the routine to set the rows attribute of the textarea
- figure out how to code a radio button in django for the mainpage form