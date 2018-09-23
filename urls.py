from django.conf.urls import include
from django.conf.urls import url
from django.contrib import admin

urlpatterns = [
  url(r'^', include(('aaronmreyes.urls', 'aaronmreyes'))),
  url(r'^admin/', admin.site.urls),
  url(r'^grappelli/', include('grappelli.urls')), # grappelli URLS for admin interface styling
  url(r'^whois/', include(('whois.urls', 'whois'))),
]

# HTTP errors are handled by aaronmreyes app
handler404 = 'aaronmreyes.views.error_404'
handler500 = 'aaronmreyes.views.error_500'
handler403 = 'aaronmreyes.views.error_403'
handler400 = 'aaronmreyes.views.error_400'
