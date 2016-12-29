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
VENV="$(which python)"
if [[ ( "/usr/bin/python" == "${VENV}" ) || ( "/usr/local/bin/python" == "${VENV}" ) ]]; then
  echo -e "\n ${BRed}[${APP}] ${Red}detected non-virtual python environment: ${VENV}"
  echo -e "${RCol}"
  exit 0
fi

if [ "$1" == "clean" ]; then
  echo -e "\n ${BGre}[${APP}] ${SP}cleaning application..."
  echo -e "${RCol}"
  find . -name \*.pyc -delete
  find . -name \*.db -delete
  echo -e "\n ${BGre}[${APP}] ${SP}done"
  echo -e "${RCol}"
  exit 0
fi

echo -e "\n ${BGre}[${APP}] ${SP}applying development settings..."
echo -e "${RCol}"
export DJANGO_SETTINGS_MODULE=settings.development

# echo -e "\n ${BGre}[${APP}] ${SP}migrating database..."
# echo -e "${RCol}"
# python manage.py makemigrations
# python manage.py migrate

echo -e "\n ${BGre}[${APP}] ${SP}starting server..."
echo -e "${RCol}"
python manage.py runserver 127.0.0.1:8000
