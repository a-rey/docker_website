"""
project development settings
"""
import os
import django.core.management.utils

# import all common settings
from settings.common import *


########## SECURITY CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = django.core.management.utils.get_random_secret_key()
########## END SECURITY CONFIGURATION


########## DEBUG CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True
TEMPLATES[0]['OPTIONS']['debug'] = DEBUG
########## END DEBUG CONFIGURATION


########## SESSION CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-secure
SESSION_COOKIE_SECURE = False
########## END SESSION CONFIGURATION


########## HOST CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ['*']
########## END HOST CONFIGURATION


########## STATIC FILES CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#static-url
STATIC_URL = '/static/'

# https://docs.djangoproject.com/en/dev/ref/settings/#static-root
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# https://docs.djangoproject.com/en/dev/ref/settings/#staticfiles-dirs
STATICFILES_DIRS = [
  # add the top level shared static files folder
  os.path.normpath(os.path.join(BASE_DIR, 'static')),
]
########## END STATIC FILES CONFIGURATION


########## DATABASE CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    'USER': '',
    'PASSWORD': '',
    'HOST': '',
    'PORT': '',
  }
}
########## END DATABASE CONFIGURATION


########## CACHE CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#caches
CACHES = {
  'default': {
    'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
  }
}
########## END CACHE CONFIGURATION

