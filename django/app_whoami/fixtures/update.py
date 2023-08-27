#!/usr/bin/env python
"""
used to update MaxMind GeoIP database fixtures for Django whoami app
"""
import os
import re
import csv
import json
import random
import shutil
import pathlib
import zipfile
import logging
import argparse
import requests
import ipaddress

FILENAME = 'app_whoami.json'
LOG_FORMAT = '[%(asctime)s][%(levelname)s] %(message)s'

# MaxMind CSV database download links
URLS = [
  'https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-ASN-CSV&license_key={0}&suffix=zip',
  'https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City-CSV&license_key={0}&suffix=zip',
]
# target CSV files for fixture generation
CSV_DBS = [
  'GeoLite2-City-Blocks-IPv4.csv',
  'GeoLite2-City-Blocks-IPv6.csv',
  'GeoLite2-ASN-Blocks-IPv4.csv',
  'GeoLite2-ASN-Blocks-IPv6.csv',
  'GeoLite2-City-Locations-en.csv',
]
# target Django app models
ASN_BLOCK_MODEL     = 'app_whoami.asnblock'
CITY_BLOCK_MODEL    = 'app_whoami.cityblock'
CITY_LOCATION_MODEL = 'app_whoami.citylocation'


if __name__ == '__main__':
  out = []
  temp = set()
  # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  # parse arguments
  # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  parser = argparse.ArgumentParser()
  parser.add_argument('-l', dest='logging_level', default='INFO', help='logging level for output', type=str)
  parser.add_argument('-k', dest='license_key', default=None, help='GeoIP Lite MaxMind License Key', type=str)
  args = parser.parse_args()
  logging.basicConfig(format=LOG_FORMAT, datefmt='%d %b %Y %H:%M:%S', level=args.logging_level)
  # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  # check for license key
  # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if not args.license_key:
    logging.warning('no license key specified?')
    args.license_key = input('enter MaxMind license key: ')
  else:
    with open(args.license_key, 'r') as f:
      args.license_key = f.read().strip()
  # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  # download each database ZIP file and extract it
  # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  for url in URLS:
    url = url.format(args.license_key)
    logging.info('GET {0} ...'.format(url))
    r = requests.get(url)
    if r.ok:
      # try to get filename
      db = re.findall('filename=(.+)', r.headers['content-disposition'])
      if not db:
        logging.warning('failed to get filename from HTTP headers? making one up ...')
        db = [''.join(random.choice(string.ascii_lowercase) for i in range(9)) + '.zip']
      # write ZIP to file
      with open(db[0], 'wb') as f:
        logging.info('downloaded {0} ...'.format(db[0]))
        temp.add(db[0]) # remember file for cleanup
        f.write(r.content)
      # extract ZIP contents
      logging.info('extracting {0} ...'.format(db[0]))
      zipf = zipfile.ZipFile(db[0], 'r')
      zipf.extractall('.')
      zipf.close()
    else:
      logging.error('failed to GET {0}'.format(url))
      logging.error('check license key and/or DB download links ...')
      exit(1)
  # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  # find each target CSV file and parse it
  # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  for filename in CSV_DBS:
    # recursive local file search
    path = [p for p in pathlib.Path('.').rglob(filename)]
    if not path:
      logging.error('failed to find CSV file {0}? is the filename correct?'.format(filename))
      exit(1)
    temp.add(os.path.dirname(path[0])) # remember directory for cleanup
    logging.info('parsing {0} ...'.format(path[0]))
    # -------------------------------------------------------------------------
    # GeoLite2-City-Blocks-IPv4.csv AND GeoLite2-City-Blocks-IPv6.csv
    # -------------------------------------------------------------------------
    if filename in ['GeoLite2-City-Blocks-IPv4.csv', 'GeoLite2-City-Blocks-IPv6.csv']:
      with open(path[0], 'r') as csvf:
        blk = [l for l in csv.DictReader(csvf) if l['geoname_id']]
        logging.info('formatting json for {0} Blocks ...'.format(len(blk)))
        for i in range(len(blk)):
          # get the start and end ranges for the IP range from MaxMind
          ip_blk = ipaddress.ip_network(blk[i]['network'])
          blk[i].update({
            'ip_start': int(ip_blk[0]),
            'ip_end': int(ip_blk[-1]),
          })
          blk[i]['ipv4'] = (ip_blk.version == 4)
          # clean up data fields to what is used by the app
          blk[i].pop('network', None)
          blk[i].pop('postal_code', None)
          blk[i].pop('accuracy_radius', None)
          blk[i].pop('is_anonymous_proxy', None)
          blk[i].pop('is_satellite_provider', None)
          blk[i].pop('registered_country_geoname_id', None)
          blk[i].pop('represented_country_geoname_id', None)
          blk[i]['geoname_id'] = int(blk[i]['geoname_id'])
          blk[i]['latitude'] = float(blk[i]['latitude']) if blk[i]['latitude'] else 0.0
          blk[i]['longitude'] = float(blk[i]['longitude']) if blk[i]['longitude'] else 0.0
          out.append({
            'model': CITY_BLOCK_MODEL,
            'pk': i,
            'fields': blk[i],
          })
    # -------------------------------------------------------------------------
    # GeoLite2-City-Locations-en.csv
    # -------------------------------------------------------------------------
    elif filename == 'GeoLite2-City-Locations-en.csv':
      with open(path[0], 'r') as csvf:
        loc = [l for l in csv.DictReader(csvf) if l['geoname_id']]
      logging.info('formatting json for {0} Locations ...'.format(len(loc)))
      for i in range(len(loc)):
        # clean up data fields
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
          'model': CITY_LOCATION_MODEL,
          'pk': i,
          'fields': loc[i],
        })
    # -------------------------------------------------------------------------
    # GeoLite2-ASN-Blocks-IPv4.csv AND GeoLite2-ASN-Blocks-IPv6.csv
    # -------------------------------------------------------------------------
    elif filename in ['GeoLite2-ASN-Blocks-IPv4.csv', 'GeoLite2-ASN-Blocks-IPv6.csv']:
      with open(path[0], 'r') as csvf:
        asn = [l for l in csv.DictReader(csvf) if l['network']]
      logging.info('formatting json for {0} ASNs ...'.format(len(asn)))
      for i in range(len(asn)):
        # get the start and end ranges for the IP range from MaxMind
        ip_blk = ipaddress.ip_network(asn[i]['network'])
        asn[i].update({
          'ip_start': int(ip_blk[0]),
          'ip_end': int(ip_blk[-1]),
        })
        asn[i]['ipv4'] = (ip_blk.version == 4)
        # clean up data fields
        asn[i].pop('network', None)
        asn[i].pop('autonomous_system_number', None)
        out.append({
          'model': ASN_BLOCK_MODEL,
          'pk': i,
          'fields': asn[i],
        })
    else:
      logging.error('unexpected CSV filename {0}?'.format(filename))
      exit(1)
  # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  # write out fixtures to json file
  # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  logging.info('writing fixture {0} ...'.format(FILENAME))
  with open(FILENAME, 'w') as f:
    f.write(json.dumps(out))
  # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  # cleanup
  # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  logging.info('cleaning up ...')
  for t in temp:
    logging.info('deleting {0} ...'.format(t))
    if os.path.isdir(t):
      shutil.rmtree(t)
    else:
      os.remove(t)
