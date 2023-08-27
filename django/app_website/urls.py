import django.urls

import app_website.views

urlpatterns = [
  django.urls.re_path(r'^$', app_website.views.main, name='main'),
]
