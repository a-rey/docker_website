import django.conf.urls

import app_website.views

urlpatterns = [
  django.conf.urls.url(r'^$', app_website.views.main, name='main'),
]
