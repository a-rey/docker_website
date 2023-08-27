import django.urls
import django.contrib.admin


urlpatterns = [
  django.urls.re_path(r'^', django.urls.include(('app_website.urls', 'app_website'))),
  django.urls.re_path(r'^whoami/', django.urls.include(('app_whoami.urls', 'app_whoami'))),
  django.urls.re_path(r'^backdoor/', django.contrib.admin.site.urls),
]

# HTTP errors are handled by app_website
handler400 = 'app_website.views.error_400'
handler403 = 'app_website.views.error_403'
handler404 = 'app_website.views.error_404'
handler500 = 'app_website.views.error_500'
