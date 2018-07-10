#!/bin/bash

# Development run script

APP="aaronmreyes"

Red='\033[0;31m';
Gre='\033[0;32m';
BRed='\033[1;31m';
BGre='\033[1;32m';
SP='\033[0;36m';
RCol='\033[0m'


echo -e "\n ${BGre}[${APP}] ${SP}checking for python virtual environment..."
echo -e "${RCol}"
if [ -z "$VIRTUAL_ENV" ]; then
  echo -e "\n ${BRed}[${APP}] ${Red}detected non-virtual python environment: ${VENV}"
  echo -e "${RCol}"
  exit 1
fi

if [ "$1" == "clean" ]; then
  echo -e "\n ${BGre}[${APP}] ${SP}cleaning application..."
  echo -e "${RCol}"
  find . -name \*.pyc -delete
  rm -rf staticfiles
  rm -f db.sqlite3
  echo -e "\n ${BGre}[${APP}] ${SP}done"
  echo -e "${RCol}"
  exit 0
fi

echo -e "\n ${BGre}[${APP}] ${SP}applying development settings..."
echo -e "${RCol}"
export DJANGO_SETTINGS_MODULE=settings.development

echo -e "\n ${BGre}[${APP}] ${SP}collecting static files..."
echo -e "${RCol}"
printf 'yes' | python manage.py collectstatic

echo -e "\n ${BGre}[${APP}] ${SP}migrating database..."
echo -e "${RCol}"
python manage.py makemigrations whoami
python manage.py migrate

echo -e "\n ${BGre}[${APP}] ${SP}freezing current requirements..."
echo -e "${RCol}"
rm -rf requirements.txt
pip freeze > requirements.txt
cat requirements.txt

echo -e "\n ${BGre}[${APP}] ${SP}creating default models..."
echo -e "${RCol}"
for i in whoami/fixtures/*.json; do python manage.py loaddata $i; done

echo -e "\n ${BGre}[${APP}] ${SP}creating surperuser account..."
echo -e "${RCol}"
python manage.py createsuperuser

echo -e "\n ${BGre}[${APP}] ${SP}starting server at 127.0.0.1:8000 ..."
echo -e "${RCol}"
python manage.py runserver 127.0.0.1:8000
