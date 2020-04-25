"""
project production settings
"""
import os
from settings.common import *


########## SECURITY CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = os.environ['SECRET_KEY']
# TODO: https://docs.djangoproject.com/en/dev/ref/middleware/#http-strict-transport-security
########## END SECURITY CONFIGURATION


########## DEBUG CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True if (os.environ['DEBUG'] == 'True') else False
TEMPLATES[0]['OPTIONS']['debug'] = DEBUG
########## END DEBUG CONFIGURATION


########## SESSION CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-secure
SESSION_COOKIE_SECURE = True
########## END SESSION CONFIGURATION


########## HOST CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ['www.arey.dev']
########## END HOST CONFIGURATION


########## DATABASE CONFIGURATION
import dj_database_url
db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES = {
  'default': db_from_env,
}
########## END DATABASE CONFIGURATION


########## STATIC FILES CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#static-url
STATIC_URL = '/static/'

# https://docs.djangoproject.com/en/dev/ref/settings/#static-root
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# https://docs.djangoproject.com/en/dev/ref/settings/#staticfiles-dirs
STATICFILES_DIRS = [
  # add a top level shared static folder
  # os.path.normpath(os.path.join(BASE_DIR, 'static')),
]
########## END STATIC FILES CONFIGURATION

