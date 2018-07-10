from django.db import models


class Block(models.Model):
  """
  Specification:
    https://dev.maxmind.com/geoip/geoip2/geoip2-city-country-csv-databases/
  Example data:
    ('geoname_id', 1810821)
    ('latitude', 26.0614)
    ('longitude', 119.3061)
    ('ip_start', 16777472)
    ('ip_end', 16777727)
  """
  ip_start = models.IntegerField()
  ip_end = models.IntegerField()
  geoname_id = models.IntegerField()
  latitude = models.FloatField()
  longitude = models.FloatField()

class Location(models.Model):
  """
  Specification:
    https://dev.maxmind.com/geoip/geoip2/geoip2-city-country-csv-databases/
  Example data:
    ('geoname_id', 49518)
    ('continent_name', 'Africa')
    ('country_name', 'Rwanda')
    ('city_name', '')
  """
  MAX_LEN = 255
  geoname_id = models.IntegerField()
  continent_name = models.CharField(max_length=MAX_LEN)
  country_name = models.CharField(max_length=MAX_LEN)
  city_name = models.CharField(max_length=MAX_LEN)

class Asn(models.Model):
  """
  Specification:
    https://dev.maxmind.com/geoip/geoip2/geoip2-city-country-csv-databases/
  Example data:
    ('autonomous_system_organization', 'Time Warner Cable Internet LLC')
    ('ip_start', 16777472)
    ('ip_end', 16777727)
  """
  MAX_LEN = 255
  ip_start = models.IntegerField()
  ip_end = models.IntegerField()
  autonomous_system_organization = models.CharField(max_length=MAX_LEN)
