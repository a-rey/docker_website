from django.conf.urls import url

from whois import views

urlpatterns = [
  url(r'^$', views.main, name='main'),
]
