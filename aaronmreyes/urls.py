from django.conf.urls import url

from aaronmreyes import views

urlpatterns = [
  url(r'^$', views.main, name='main'),
]
