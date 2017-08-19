from django.http import JsonResponse

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
        info[h] = request.META[h]
  return JsonResponse(info)
