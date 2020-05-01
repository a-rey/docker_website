"""
project production settings
"""
import os
from settings.common import *


########## SECURITY CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
########## END SECURITY CONFIGURATION


########## DEBUG CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True if (os.environ['DJANGO_DEBUG'] == 'True') else False
TEMPLATES[0]['OPTIONS']['debug'] = DEBUG
########## END DEBUG CONFIGURATION


########## SESSION CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-secure
SESSION_COOKIE_SECURE = True
########## END SESSION CONFIGURATION


########## HOST CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ['arey.dev']

# https://docs.djangoproject.com/en/dev/ref/settings/#use-x-forwarded-host
USE_X_FORWARDED_HOST = True
########## END HOST CONFIGURATION


########## SECURITY CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#secure-proxy-ssl-header
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# https://docs.djangoproject.com/en/dev/ref/settings/#secure-ssl-redirect
SECURE_SSL_REDIRECT = True
########## END SECURITY CONFIGURATION


########## CSRF CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#csrf-cookie-secure
CSRF_COOKIE_SECURE = True
########## END CSRF CONFIGURATION


########## STATIC FILES CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#static-url
STATIC_URL = '/static/'

# https://docs.djangoproject.com/en/dev/ref/settings/#static-root
STATIC_ROOT = os.path.join(BASE_DIR, '__staticfiles')

# https://docs.djangoproject.com/en/dev/ref/settings/#staticfiles-dirs
STATICFILES_DIRS = [
  # add a top level shared static folder
  # os.path.normpath(os.path.join(BASE_DIR, 'static')),
]
########## END STATIC FILES CONFIGURATION


########## DATABASE CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': os.environ['POSTGRES_DB'],
    'USER': os.environ['POSTGRES_USER'],
    'PASSWORD': os.environ['POSTGRES_PASSWORD'],
    'HOST': os.environ['POSTGRES_HOST'],
    'PORT': os.environ['POSTGRES_PORT'],
  }
}
########## END DATABASE CONFIGURATION


########## CACHE CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#caches
# https://docs.djangoproject.com/en/dev/topics/cache/
# https://jazzband.github.io/django-redis/latest/#_configure_as_cache_backend
CACHES = {
  'default': {
    'BACKEND': 'django_redis.cache.RedisCache',
    'LOCATION': '{0}://{1}:{2}/{3}'.format(
      os.environ['REDIS_CONNECTION_TYPE'],
      os.environ['REDIS_HOST'],
      os.environ['REDIS_PORT'],
      os.environ['REDIS_DB']),
    'TIMEOUT': int(os.environ['REDIS_TTL']),
    'OPTIONS': {
      'CLIENT_CLASS': 'django_redis.client.DefaultClient',
      'PASSWORD': os.environ['REDIS_PASS'],
    },
  }
}
########## END CACHE CONFIGURATION

