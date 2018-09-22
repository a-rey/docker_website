from django.http import JsonResponse

from whois.models import Asn
from whois.models import Block
from whois.models import Location

import re

def main(request):
  info = {}
  # get client IP
  ip = request.META.get('HTTP_X_FORWARDED_FOR', None)
  if ip:
    # X_FORWARDED_FOR returns client1, proxy1, proxy2,...
    info['IP'] = ip.split(', ')[0]
  else:
    info['IP'] = request.META.get('REMOTE_ADDR', '')
  # extract HTTP headers
  headers_regex = re.compile(r'^(HTTP_.+|CONTENT_TYPE|CONTENT_LENGTH)$')
  for h in request.META:
    if headers_regex.match(h):
      info[h.replace('HTTP_', '')] = request.META[h]
  # get the geoname_id for this IP
  try:
    n = [int(x) for x in info['IP'].split('.')]
    _ip = (n[0] * (1 << 24)) + (n[1] * (1 << 16)) + (n[2] * (1 << 8)) + n[3]
    blk = Block.objects.filter(ip_start__lte=_ip, ip_end__gte=_ip).values().first()
    asn = Asn.objects.filter(ip_start__lte=_ip, ip_end__gte=_ip).values().first()
    loc = Location.objects.filter(geoname_id=blk['geoname_id']).values().first()
    # cleanup response
    blk.pop('id', None)
    blk.pop('ip_end', None)
    blk.pop('ip_start', None)
    blk.pop('geoname_id', None)
    asn.pop('id', None)
    asn.pop('ip_end', None)
    asn.pop('ip_start', None)
    loc.pop('id', None)
    loc.pop('geoname_id', None)
    for k in blk:
      info[k.upper()] = blk[k]
    for k in loc:
      info[k.upper()] = loc[k]
    for k in asn:
      info[k.upper()] = asn[k]
  except:
    pass
  # set CORs headers
  r = JsonResponse(info)
  r['Access-Control-Allow-Origin'] = 'https://www.aaronmreyes.com'
  r['Access-Control-Allow-Methods'] = 'GET'
  r['Access-Control-Allow-Credentials'] = 'false'
  r['Access-Control-Max-Age'] = '-1'
  return r
