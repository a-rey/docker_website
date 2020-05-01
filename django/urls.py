import django.conf.urls
import django.contrib.admin


urlpatterns = [
  django.conf.urls.url(r'^', django.conf.urls.include(('app_website.urls', 'app_website'))),
  django.conf.urls.url(r'^whoami/', django.conf.urls.include(('app_whoami.urls', 'app_whoami'))),
  django.conf.urls.url(r'^backdoor/', django.contrib.admin.site.urls),
]

# HTTP errors are handled by app_website
handler400 = 'app_website.views.error_400'
handler403 = 'app_website.views.error_403'
handler404 = 'app_website.views.error_404'
handler500 = 'app_website.views.error_500'
