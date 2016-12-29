from django.conf.urls import url

from xmas_lights import views

urlpatterns = [
  url(r'^$', views.home, name='home'),
]
