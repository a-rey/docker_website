import app_website
import django.conf.urls

urlpatterns = [
  django.conf.urls.url(r'^$', app_website.views.main, name='main'),
]
