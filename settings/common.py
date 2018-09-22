"""
Common Django settings for project

For more information on this file, see
https://docs.djangoproject.com/en/dev/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/dev/ref/settings/
"""

import os


########## PATH CONFIGURATION
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
########## END PATH CONFIGURATION


########## URL CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#root-urlconf
ROOT_URLCONF = 'urls'
########## END URL CONFIGURATION


########## WSGI CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#wsgi-application
WSGI_APPLICATION = 'wsgi.application'
########## END WSGI CONFIGURATION


########## SECURITY CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#secure-browser-xss-filter
SECURE_BROWSER_XSS_FILTER = True

# https://docs.djangoproject.com/en/dev/ref/settings/#secure-content-type-nosniff
SECURE_CONTENT_TYPE_NOSNIFF = True

# https://docs.djangoproject.com/en/dev/ref/settings/#csrf-cookie-name
CSRF_COOKIE_NAME = 'csrf'

# https://docs.djangoproject.com/en/dev/ref/settings/#csrf-cookie-httponly
CSRF_COOKIE_HTTPONLY = True

# https://docs.djangoproject.com/en/dev/ref/settings/#csrf-use-sessions
CSRF_USE_SESSIONS = True

# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-samesite
SESSION_COOKIE_SAMESITE = 'Strict'

# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-secure
SESSION_COOKIE_SECURE = True

# https://docs.djangoproject.com/en/dev/ref/settings/#x-frame-options
X_FRAME_OPTIONS = 'DENY'
########## END SECURITY CONFIGURATION


########## SESSION CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-name
SESSION_COOKIE_NAME = 'wtf'

# https://docs.djangoproject.com/en/dev/ref/settings/#session-expire-at-browser-close
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

# https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-SESSION_ENGINE
SESSION_ENGINE = 'django.contrib.sessions.backends.db'

# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-httponly
SESSION_COOKIE_HTTPONLY = True
########## END SESSION CONFIGURATION


########## APP CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps
INSTALLED_APPS = [
  'grappelli',
  'django.contrib.admin',
  'django.contrib.auth',
  'django.contrib.contenttypes',
  'django.contrib.sessions',
  'django.contrib.messages',
  'django.contrib.staticfiles',
  'aaronmreyes',
  'whois',
]
########## END APP CONFIGURATION


########## MIDDLEWARE CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/middleware/
MIDDLEWARE = [
  'django.middleware.security.SecurityMiddleware',
  'django.contrib.sessions.middleware.SessionMiddleware',
  'django.middleware.common.CommonMiddleware',
  'django.middleware.csrf.CsrfViewMiddleware',
  'django.contrib.auth.middleware.AuthenticationMiddleware',
  'django.contrib.messages.middleware.MessageMiddleware',
  'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
########## END MIDDLEWARE CONFIGURATION


########## TEMPLATE CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-TEMPLATES
TEMPLATES = [
  {
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'APP_DIRS': True, # look inside /<app>/template
    'DIRS': [
      os.path.normpath(os.path.join(BASE_DIR, 'templates')),
    ],
    'OPTIONS': {
      'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
      ],
    },
  },
]
########## END TEMPLATE CONFIGURATION


########## INTERNATIONALIZATION CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#language-code
LANGUAGE_CODE = 'en-us'

# https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-TIME_ZONE
TIME_ZONE = 'UTC'

# https://docs.djangoproject.com/en/dev/ref/settings/#use-i18n
USE_I18N = False

# https://docs.djangoproject.com/en/dev/ref/settings/#use-l10n
USE_L10N = True

# https://docs.djangoproject.com/en/dev/ref/settings/#use-tz
USE_TZ = True
########## END INTERNATIONALIZATION CONFIGURATION


########## STATIC FILES CONFIGURATION
# https://docs.djangoproject.com/en/dev/ref/settings/#static-url
STATIC_URL = '/static/'

# https://docs.djangoproject.com/en/dev/ref/settings/#static-root
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# https://docs.djangoproject.com/en/dev/ref/settings/#staticfiles-dirs
STATICFILES_DIRS = [
  os.path.normpath(os.path.join(BASE_DIR, 'static')),
]
########## END STATIC FILES CONFIGURATION

