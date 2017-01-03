from django.conf.urls import url

from pixels import views

urlpatterns = [
  url(r'^$', views.home, name='home'),
  url(r'^download/$', views.download, name='download'),
]
