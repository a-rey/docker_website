# current URLs from https://dev.maxmind.com/geoip/geoip2/geolite2/
# - http://geolite.maxmind.com/download/geoip/database/GeoLite2-City-CSV.zip
# - http://geolite.maxmind.com/download/geoip/database/GeoLite2-ASN-CSV.zip
import requests
import argparse
import logging
import zipfile
import shutil
import json
import csv
import os

BLK = 5000
LOG_FORMAT = '[%(asctime)s][%(levelname)s] %(message)s'

def cidr2int(cidr):
  mask = hex((0x100000000 >> int(cidr)) - 1)[2:].zfill(8)
  n = [int(mask[j:j+2], 16) for j in range(0, len(mask), 2)]
  return (n[0] * (1 << 24)) + (n[1] * (1 << 16)) + (n[2] * (1 << 8)) + n[3]

def ip2int(ip):
  n = [int(x) for x in ip.split('.')]
  return (n[0] * (1 << 24)) + (n[1] * (1 << 16)) + (n[2] * (1 << 8)) + n[3]

if __name__ == '__main__':
  # parse arguments
  parser = argparse.ArgumentParser()
  parser.add_argument('-l', dest='logging_level', default='INFO', help='logging level for output', type=str)
  args = parser.parse_args()
  # setup logger
  logging.basicConfig(format=LOG_FORMAT, datefmt='%d %b %Y %H:%M:%S', level=args.logging_level)
  # download and parse data
  out = []
  blk = []
  loc = []
  asn = []
  city_url = input('MaxMind GeoLiteCity URL: ')
  logging.info('downloading {0} ...'.format(city_url))
  with open('GeoLiteCity.zip', 'wb') as f:
    r = requests.get(city_url)
    f.write(r.content)
  f = zipfile.ZipFile('GeoLiteCity.zip', 'r')
  f.extractall('.')
  f.close()
  city_dirname = [f for f in os.listdir('.') if f.startswith('GeoLite2-City')][0]
  logging.info('extracting {0}/GeoLite2-City-Blocks-IPv4.csv ...'.format(city_dirname))
  with open(city_dirname + '/GeoLite2-City-Blocks-IPv4.csv', 'r') as b:
    blk = [r for r in csv.DictReader(b) if r['geoname_id']]
  logging.info('formatting json for {0} blocks ...'.format(len(blk)))
  for i in range(len(blk)):
    # get the start and end ranges for the IP range from MaxMind
    n = blk[i]['network'].split('/')
    _start = ip2int(n[0])
    _end = _start + cidr2int(n[1])
    # clean up data fields
    blk[i].update({'_ipstart': _start, '_ipend': _end})
    blk[i].pop('network', None)
    blk[i].pop('postal_code', None)
    blk[i].pop('accuracy_radius', None)
    blk[i].pop('is_anonymous_proxy', None)
    blk[i].pop('is_satellite_provider', None)
    blk[i].pop('registered_country_geoname_id', None)
    blk[i].pop('represented_country_geoname_id', None)
    blk[i]['geoname_id'] = int(blk[i]['geoname_id'])
    blk[i]['latitude'] = float(blk[i]['latitude'])
    blk[i]['longitude'] = float(blk[i]['longitude'])
    out.append({
      'model': 'whoami.block',
      'pk': i,
      'fields': blk[i],
    })
  logging.info('extracting {0}/GeoLite2-City-Locations-en.csv ...'.format(city_dirname))
  with open(city_dirname + '/GeoLite2-City-Locations-en.csv', 'r') as l:
    loc = [r for r in csv.DictReader(l) if r['geoname_id']]
  logging.info('formatting json for {0} locations ...'.format(len(loc)))
  for i in range(len(loc)):
    loc[i].pop('locale_code', None)
    loc[i].pop('continent_code', None)
    loc[i].pop('country_iso_code', None)
    loc[i].pop('subdivision_1_name', None)
    loc[i].pop('subdivision_2_name', None)
    loc[i].pop('subdivision_1_iso_code', None)
    loc[i].pop('subdivision_2_iso_code', None)
    loc[i].pop('metro_code', None)
    loc[i].pop('time_zone', None)
    loc[i].pop('is_in_european_union', None)
    loc[i]['geoname_id'] = int(loc[i]['geoname_id'])
    out.append({
      'model': 'whoami.location',
      'pk': i,
      'fields': loc[i],
    })
  asn_url = input('MaxMind GeoLiteASN URL: ')
  logging.info('downloading {0} ...'.format(asn_url))
  with open('GeoLiteASN.zip', 'wb') as f:
    r = requests.get(asn_url)
    f.write(r.content)
  f = zipfile.ZipFile('GeoLiteASN.zip', 'r')
  f.extractall('.')
  f.close()
  asn_dirname = [f for f in os.listdir('.') if f.startswith('GeoLite2-ASN')][0]
  logging.info('extracting {0}/GeoLite2-ASN-Blocks-IPv4.csv ...'.format(asn_dirname))
  with open(asn_dirname + '/GeoLite2-ASN-Blocks-IPv4.csv', 'r') as b:
    asn = [r for r in csv.DictReader(b) if r['network']]
  logging.info('formatting json for {0} ASNs ...'.format(len(asn)))
  for i in range(len(asn)):
    # get the start and end ranges for the IP range from MaxMind
    n = asn[i]['network'].split('/')
    _start = ip2int(n[0])
    _end = _start + cidr2int(n[1])
    # clean up data fields
    asn[i].update({'_ipstart': _start, '_ipend': _end})
    asn[i].pop('network', None)
    asn[i].pop('autonomous_system_number', None)
    out.append({
      'model': 'whoami.asn',
      'pk': i,
      'fields': asn[i],
    })
  # write out fixtures in chunks to avoid a massive file
  for i in range(0, len(out), BLK):
    logging.info('writing fixture whoami_{0}.json ...'.format(i))
    with open('whoami_{0}.json'.format(i), 'w') as f:
      f.write(json.dumps(out[i:i+BLK]))
  logging.info('cleaning up ...')
  os.remove('GeoLiteCity.zip')
  os.remove('GeoLiteASN.zip')
  shutil.rmtree(asn_dirname)
  shutil.rmtree(city_dirname)
