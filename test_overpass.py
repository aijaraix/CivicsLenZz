import requests
import json

query = """
[out:json];
relation["boundary"="administrative"]["name"~"District 34", i]["admin_level"="8"];
out geom;
"""
r = requests.post("https://overpass-api.de/api/interpreter", data={"data": query})
print(r.text[:1000])
