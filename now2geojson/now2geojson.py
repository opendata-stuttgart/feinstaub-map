#!/usr/bin/env python

# https leads to ssl error, use http

import json
import geojson
import argparse
import requests

parser = argparse.ArgumentParser(description='Process /now/ data from luftdaten.info api to geojson')
#parser.add_argument('-f', '--filename', default='', nargs='*', type=str, dest='filename',
                   #help='read json from file')
parser.add_argument('-p', '--polygons', action="store_true", dest='polygons',
                   help='output polygons instead of points')
parser.add_argument('-o', '--outfilename', default='', type=str, dest='outfilename',
                   help='write geojson to file (default: stdout)')
parser.add_argument('-u', '--url', default='http://api.luftdaten.info/v1/now/?format=json', type=str, dest='url',
                   help='read json from url')


args=parser.parse_args()

if args.url:
    r = requests.get(args.url)
    j=json.loads(r.text)

# feature list
featl=[]

for sen in j:
    if (sen['location']['latitude'] is None) | (sen['location']['longitude'] is None):
        # no location information, forget about this one
        continue
    dl=0.001 # length of side
    lat=float(sen['location']['latitude'])
    lon=float(sen['location']['longitude'])
    if args.polygons:
        # create rectangle, in clockwise direction
        p=geojson.Polygon([[
                            (lon,lat),
                            (lon,lat+dl),
                            (lon+dl,lat+dl),
                            (lon+dl,lat),
                            (lon,lat)
                        ]])
    else:
        p=geojson.Point((lon,lat))
    # assemble properties
    prop={}
    prop['sensorid']=sen['sensor']['id']
    prop['sensorname']=sen['sensor']['sensor_type']['name']
    prop['timestamp']=sen['timestamp']
    for pr in sen['sensordatavalues']:
        prop[pr['value_type']]= float(pr['value'])
    f=geojson.Feature(geometry=p,properties=prop)
    featl.append(f)

# create a feature collection from feature list
featcoll=geojson.FeatureCollection(featl) #  empty feature list

if not args.outfilename:
    # to stdout
    print(geojson.dumps(featcoll))
else:
    with open(args.outfilename,'w') as o:
        geojson.dump(featcoll,o)
