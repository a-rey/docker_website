import django.db.models
import django.utils.timezone

MAX_STR_LEN = 256                          # max length of DB strings
MAX_IP_DIGITS = len(str((0x1 << 128) - 1)) # number of digits for IPv6 addresses


class CityBlock(django.db.models.Model):
  """
  Description:
    A block of IPv4 or IPv6 space assigned to a geoname_id
  Specification:
    https://dev.maxmind.com/geoip/geoip2/geoip2-city-country-csv-databases/
  Example data:
    ('geoname_id', 1810821)
    ('latitude', 26.0614)
    ('longitude', 119.3061)
    ('ip_start', 16777472)
    ('ip_end', 16777727)
  """
  id = django.db.models.AutoField(primary_key=True)
  ipv4 = django.db.models.BooleanField(default=True)
  ip_start = django.db.models.DecimalField(max_digits=MAX_IP_DIGITS, decimal_places=0)
  ip_end = django.db.models.DecimalField(max_digits=MAX_IP_DIGITS, decimal_places=0)
  geoname_id = django.db.models.IntegerField()
  latitude = django.db.models.FloatField()
  longitude = django.db.models.FloatField()
  created_at = django.db.models.DateTimeField(default=django.utils.timezone.now, editable=False)


class CityLocation(django.db.models.Model):
  """
  Description:
    A city/country/continent assigned to a geoname_id
  Specification:
    https://dev.maxmind.com/geoip/geoip2/geoip2-city-country-csv-databases/
  Example data:
    ('geoname_id', 49518)
    ('continent_name', 'Africa')
    ('country_name', 'Rwanda')
    ('city_name', '')
  """
  id = django.db.models.AutoField(primary_key=True)
  geoname_id = django.db.models.IntegerField()
  continent_name = django.db.models.CharField(max_length=MAX_STR_LEN)
  country_name = django.db.models.CharField(max_length=MAX_STR_LEN)
  city_name = django.db.models.CharField(max_length=MAX_STR_LEN)
  created_at = django.db.models.DateTimeField(default=django.utils.timezone.now, editable=False)


class AsnBlock(django.db.models.Model):
  """
  Description:
    A block of IPv4 or IPv6 space assigned to an ASN
  Specification:
    https://dev.maxmind.com/geoip/geoip2/geoip2-city-country-csv-databases/
  Example data:
    ('autonomous_system_organization', 'Time Warner Cable Internet LLC')
    ('ip_start', 16777472)
    ('ip_end', 16777727)
  """
  id = django.db.models.AutoField(primary_key=True)
  ipv4 = django.db.models.BooleanField(default=True)
  ip_start = django.db.models.DecimalField(max_digits=MAX_IP_DIGITS, decimal_places=0)
  ip_end = django.db.models.DecimalField(max_digits=MAX_IP_DIGITS, decimal_places=0)
  autonomous_system_organization = django.db.models.CharField(max_length=MAX_STR_LEN)
  created_at = django.db.models.DateTimeField(default=django.utils.timezone.now, editable=False)
