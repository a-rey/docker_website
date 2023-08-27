import django.urls

import app_whoami.views


urlpatterns = [
  django.urls.re_path(r'^$', app_whoami.views.main, name='main'),
]
