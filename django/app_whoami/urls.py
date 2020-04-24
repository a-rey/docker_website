import django.conf.urls

import app_whoami.views


urlpatterns = [
  django.conf.urls.url(r'^$', app_whoami.views.main, name='main'),
]
