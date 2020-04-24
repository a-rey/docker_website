import django.contrib.admin

import app_whoami.models


class CityBlockAdmin(django.contrib.admin.ModelAdmin):
  readonly_fields = ['created_at']
  list_display = ['get_created_at',
                  'get_geoname_id',
                  'get_ipv4',
                  'get_latitude',
                  'get_longitude',
                  'get_ip_start',
                  'get_ip_end']

  def get_created_at(self, obj):
    return obj.created_at

  get_created_at.admin_order_field = 'created_at'    # NOTE: allows column order sorting
  get_created_at.short_description = 'Creation Date' # NOTE: renames column head in UI

  def get_geoname_id(self, obj):
    return obj.geoname_id

  get_geoname_id.admin_order_field = 'geoname_id'
  get_geoname_id.short_description = 'Geoname Id'

  def get_ipv4(self, obj):
    return obj.ipv4

  get_ipv4.admin_order_field = 'ipv4'
  get_ipv4.short_description = 'IPv4'

  def get_ip_start(self, obj):
    return obj.ip_start

  get_ip_start.admin_order_field = 'ip_start'
  get_ip_start.short_description = 'Start IP'

  def get_ip_end(self, obj):
    return obj.ip_end

  get_ip_end.admin_order_field = 'ip_end'
  get_ip_end.short_description = 'End IP'

  def get_latitude(self, obj):
    return obj.latitude

  get_latitude.admin_order_field = 'latitude'
  get_latitude.short_description = 'Latitude'

  def get_longitude(self, obj):
    return obj.longitude

  get_longitude.admin_order_field = 'longitude'
  get_longitude.short_description = 'Longitude'


class CityLocationAdmin(django.contrib.admin.ModelAdmin):
  readonly_fields = ['created_at']
  list_display = ['get_created_at',
                  'get_geoname_id',
                  'get_continent_name',
                  'get_country_name',
                  'get_city_name']

  def get_created_at(self, obj):
    return obj.created_at

  get_created_at.admin_order_field = 'created_at'    # NOTE: allows column order sorting
  get_created_at.short_description = 'Creation Date' # NOTE: renames column head in UI

  def get_geoname_id(self, obj):
    return obj.geoname_id

  get_geoname_id.admin_order_field = 'geoname_id'
  get_geoname_id.short_description = 'Geoname Id'

  def get_continent_name(self, obj):
    return obj.continent_name

  get_continent_name.admin_order_field = 'continent_name'
  get_continent_name.short_description = 'Continent'

  def get_country_name(self, obj):
    return obj.country_name

  get_country_name.admin_order_field = 'country_name'
  get_country_name.short_description = 'Country'

  def get_city_name(self, obj):
    return obj.city_name

  get_city_name.admin_order_field = 'city_name'
  get_city_name.short_description = 'City'


class AsnBlockAdmin(django.contrib.admin.ModelAdmin):
  readonly_fields = ['created_at']
  list_display = ['get_created_at',
                  'get_ipv4',
                  'get_autonomous_system_organization',
                  'get_ip_start',
                  'get_ip_end']

  def get_created_at(self, obj):
    return obj.created_at

  get_created_at.admin_order_field = 'created_at'    # NOTE: allows column order sorting
  get_created_at.short_description = 'Creation Date' # NOTE: renames column head in UI

  def get_ipv4(self, obj):
    return obj.ipv4

  get_ipv4.admin_order_field = 'ipv4'
  get_ipv4.short_description = 'IPv4'

  def get_ip_start(self, obj):
    return obj.ip_start

  get_ip_start.admin_order_field = 'ip_start'
  get_ip_start.short_description = 'Start IP'

  def get_ip_end(self, obj):
    return obj.ip_end

  get_ip_end.admin_order_field = 'ip_end'
  get_ip_end.short_description = 'End IP'

  def get_autonomous_system_organization(self, obj):
    return obj.autonomous_system_organization

  get_autonomous_system_organization.admin_order_field = 'autonomous_system_organization'
  get_autonomous_system_organization.short_description = 'ASN'


django.contrib.admin.site.register(app_whoami.models.AsnBlock, AsnBlockAdmin)
django.contrib.admin.site.register(app_whoami.models.CityBlock, CityBlockAdmin)
django.contrib.admin.site.register(app_whoami.models.CityLocation, CityLocationAdmin)
