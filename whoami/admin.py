from django.contrib import admin


class BlockAdmin(admin.ModelAdmin):
  list_display = ('get_geoname_id', 'get_ip_start', 'get_ip_end', 'get_latitude', 'get_longitude')

  def get_geoname_id(self, obj):
    return obj.geoname_id

  get_geoname_id.admin_order_field = 'geoname_id' # Allows column order sorting
  get_geoname_id.short_description = 'Geoname Id' # Renames column head in UI

  def get_ip_start(self, obj):
    return obj._startip

  get_ip_start.admin_order_field = '_ipstart' # Allows column order sorting
  get_ip_start.short_description = 'Start IP' # Renames column head in UI

  def get_ip_end(self, obj):
    return obj._ipend

  get_ip_end.admin_order_field = '_ipend' # Allows column order sorting
  get_ip_end.short_description = 'End IP' # Renames column head in UI

  def get_latitude(self, obj):
    return obj.latitude

  get_latitude.admin_order_field = 'latitude' # Allows column order sorting
  get_latitude.short_description = 'Latitude' # Renames column head in UI

  def get_longitude(self, obj):
    return obj.longitude

  get_longitude.admin_order_field = 'longitude' # Allows column order sorting
  get_longitude.short_description = 'Longitude' # Renames column head in UI


class LocationAdmin(admin.ModelAdmin):
  list_display = ('get_geoname_id', 'get_continent_name', 'get_country_name', 'get_city_name')

  def get_geoname_id(self, obj):
    return obj.geoname_id

  get_geoname_id.admin_order_field = 'geoname_id' # Allows column order sorting
  get_geoname_id.short_description = 'Geoname Id' # Renames column head in UI

  def get_continent_name(self, obj):
    return obj.continent_name

  get_continent_name.admin_order_field = 'continent_name' # Allows column order sorting
  get_continent_name.short_description = 'Continent'      # Renames column head in UI

  def get_country_name(self, obj):
    return obj.country_name

  get_country_name.admin_order_field = 'country_name' # Allows column order sorting
  get_country_name.short_description = 'Country'      # Renames column head in UI

  def get_city_name(self, obj):
    return obj.city_name

  get_city_name.admin_order_field = 'city_name' # Allows column order sorting
  get_city_name.short_description = 'City'      # Renames column head in UI


class AsnAdmin(admin.ModelAdmin):
  list_display = ('get_ip_start', 'get_ip_end', 'get_autonomous_system_organization')

  def get_ip_start(self, obj):
    return obj._startip

  get_ip_start.admin_order_field = '_ipstart' # Allows column order sorting
  get_ip_start.short_description = 'Start IP' # Renames column head in UI

  def get_ip_end(self, obj):
    return obj._ipend

  get_ip_end.admin_order_field = '_ipend' # Allows column order sorting
  get_ip_end.short_description = 'End IP' # Renames column head in UI

  def get_autonomous_system_organization(self, obj):
    return obj.autonomous_system_organization

  get_autonomous_system_organization.admin_order_field = 'autonomous_system_organization'
  get_autonomous_system_organization.short_description = 'ASN'

