# feinstaub-map

## [Live Version](http://opendata-stuttgart.github.io/feinstaub-map/)

## Goals and ideas

* visualize recent sensor data on a map
* identify and add existing air quality data from external sources
* gather air quality data on-the-go, develop a mobile solution, measure tracks
* visualize the track data on a map, too

## Mobile sensor

* add GPS to existing sensor setup, see [commit](https://github.com/opendata-stuttgart/sensors-software/commit/58ff3fc409eb353f7f1e25051d55f153be9601b7)
* enable push GPS data to Django API (changes for GPS measurements see [commit](https://github.com/opendata-stuttgart/feinstaub-api/commit/6b0a1d20685b5e9dd3dcb351e9b0b8860465e8df)) and/or via MQTT



## Visualisation

This map visualisation was hacked during the NASA Space-Apps challenge 2016
https://2016.spaceappschallenge.org/locations/stuttgart-germany

The necessary steps were:

* adapt the django API: request to get the latest measurement values
* create a map visualisation based on the API inputs

Repository is located at <https://github.com/opendata-stuttgart/feinstaub-map>

### Django API changes

mfa provided the changes to the API (see [commit](https://github.com/opendata-stuttgart/feinstaub-api/commit/3ebbce1b70d6454ff1371112fe14385c3d475b4b))

### Map application

The map background is based on [OpenStreetMap](http://openstreetmap.org/) provided via [mapbox](https://www.mapbox.com/).
The application itself was created in JavaScript on top of a [leaflet](http://leafletjs.com/) layer.

The implemetation makes use of various frameworks and is on ECMA6 language level.
Used frameworks are:

* [leaflet](http://leafletjs.com/) (mapping framework)
* [lodash](https://lodash.com/) (map, reduce, reorder data sets)
* [vue](http://vuejs.org/)
* [webpack](https://webpack.github.io/) is used for deployment

## Usage

### Installation

npm install

### Develop

npm start

### Publish

npm run deploy
