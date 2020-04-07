from django.conf.urls import include
from django.conf.urls import url
from django.contrib import admin

urlpatterns = [
  url(r'^', include(('website.urls', 'website'))),
  url(r'^whois/', include(('whois.urls', 'whois'))),
  # TODO: admin site
  url(r'^null/', admin.site.urls),
]

# HTTP errors are handled by website app
handler404 = 'website.views.error_404'
handler500 = 'website.views.error_500'
handler403 = 'website.views.error_403'
handler400 = 'website.views.error_400'
