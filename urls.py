from django.conf.urls import include
from django.conf.urls import url
from django.contrib import admin

urlpatterns = [
  url(r'^admin/', include(admin.site.urls)),
  url(r'^grappelli/', include('grappelli.urls')), # grappelli URLS for admin interface styling
  url(r'^pixels/', include('pixels.urls', namespace='pixels')),
]
