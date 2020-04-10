import django.contrib
import django.conf.urls

urlpatterns = [
  django.conf.urls.url(r'^', django.conf.urls.include(('app_website.urls', 'app_website'))),
  django.conf.urls.url(r'^admin/', django.contrib.admin.site.urls),
]

# HTTP errors are handled by app_website
handler404 = 'app_website.views.error_404'
handler500 = 'app_website.views.error_500'
handler403 = 'app_website.views.error_403'
handler400 = 'app_website.views.error_400'
