import decimal
import ipaddress

import django.http

import app_whoami.models


def main(request):
  """
  request handler for '/'.
  """
  # try to get client IP from HTTP header
  raw_ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', None))
  if not raw_ip:
    return django.http.JsonResponse({'error': 'IP header not found'})
  # X_FORWARDED_FOR: client1, proxy1, proxy2, ...
  raw_ip = raw_ip.split(',')[0].strip()
  if not raw_ip:
    return django.http.JsonResponse({'error': 'IP header format invalid'})
  # try to parse the user IP
  try:
    ip = ipaddress.ip_address(raw_ip)
    results = {'IP': str(ip)}
  except:
    return django.http.JsonResponse({'error': 'IP header value invalid'})
  # lookup ASN IP block
  asn_blk = app_whoami.models.AsnBlock.objects.filter(
    ip_start__lte=decimal.Decimal(int(ip)),
    ip_end__gte=decimal.Decimal(int(ip)),
    ipv4=(ip.version == 4)
  ).values().first()
  # combine info into one object
  if asn_blk:
    results.update(asn_blk)
  # lookup city IP block
  city_blk = app_whoami.models.CityBlock.objects.filter(
    ip_start__lte=decimal.Decimal(int(ip)),
    ip_end__gte=decimal.Decimal(int(ip)),
    ipv4=(ip.version == 4)
  ).values().first()
  if city_blk:
    # from city IP block, lookup city location
    city_loc = app_whoami.models.CityLocation.objects.filter(
      geoname_id=city_blk['geoname_id']
    ).values().first()
    # combine info into one object
    if city_loc:
      results.update(city_loc)
    results.update(city_blk)
  # remove backend lookup values from response
  results.pop('id', None)
  results.pop('ipv4', None)
  results.pop('ip_end', None)
  results.pop('ip_start', None)
  results.pop('geoname_id', None)
  # format creation timestamp
  if 'created_at' in results:
    results['created_at'] = results['created_at'].strftime('%d %b %Y %H:%M:%S %Z')
  # change keys to be uppercase
  results = {k.upper(): v for k, v in results.items()}
  return django.http.JsonResponse(results)
