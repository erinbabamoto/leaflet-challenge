// We create the tile layers that will be the selectable backgrounds of our map.

// Create a L.tilelayer() using the 'mapbox/light-v10' map id
var grayMap = L.tilelayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
                            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
                            tileSize: 512,
                            maxZoom: 18,
                            zoomOffset: -1,
                            id: "mapbox/light-v10",
                            accessToken: API_KEY});

// Create a L.tilelayer() using the 'mapbox/satellite-v9' map id
var satelliteMap = L.tilelayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
                                attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
                                tileSize: 512,
                                maxZoom: 18,
                                zoomOffset: -1,
                                id: "mapbox/satellite-v9",
                                accessToken: API_KEY});

// Create a L.tilelayer() using the 'mapbox/satellite-v9' map id
var outdoorsMap = L.tilelayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
                                attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
                                tileSize: 512,
                                maxZoom: 18,
                                zoomOffset: -1,
                                id: "mapbox/satellite-v9", // outdoors-v#
                                accessToken: API_KEY});


// We then create the map object with options. Adding the tile layers we just
// created to an array of layers.

// Create a L.map(), reference the 'mapid' element in the HTML page, and pass in the three layers above
var basemapId = "mapid"
var basemapOptions = {center: [34.0522, -118.2437], // Los Angeles coordinates
                      zoom: 3,
                      layers: [grayMap, satelliteMap, outdoorsMap]}
var myMap = L.map(basemapId, basemapOptions);

// We create the layers for our two different sets of data, earthquakes and
// tectonicplates.
// var tectonicPlates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

// Defining an object that contains all of our different map choices. Only one
// of these maps will be visible at a time!
// Create a basemaps object for the three tileLayers from above. 
// The key should be a human readable name for the tile layer, and the value should be a tileLayer variable
var baseMaps = {
  "Gray Map": grayMap,
  "Satellite Map": satelliteMap,
  "Outdoors Map": outdoorsMap
};

// We define an object that contains all of our overlays. Any combination of
// these overlays may be visible at the same time!

// Create a overlays object for the two LayerGroups from above. 
// The key should be a human readable name for the layer group, and the value should be a LayerGroup variable
var overlayMaps = {
  // "Tectonic Plates": tectonicPlates,
  "Earthquakes": earthquakes
};

// Add a L.control.layers() object and pass in the baseMaps and overlayMaps, and then .addTo myMap
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Use d3.json() to call the API endpoint for earthquake geoJSON data, 
// .then() fire off an anonymous function that takes a single argument `data`.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson").then(function(geojsonData) {
  // Use L.geoJson() to parse the data, and do the following:
  L.geoJson(geojsonData, {
    // use pointToLayer to convert each feature to an L.circleMarker, see https://geospatialresponse.wordpress.com/2015/07/26/leaflet-geojson-pointtolayer/ for a tutorial
    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, {
        radius: 10,
        fillOpacity: 0.75
      });
    },
    // use style to set the color, radius, and other options for each circleMarker dynamically using the magnitude data
    style: function(feature) {
      return {
        color: "orange",
        radius: 10
      };
    },
    // use onEachFeature to bind a popup with the magnitude and location of the earthquake to the layer (see above tutorial for an example)
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: " + feature.properties.mag +
        "<br>Depth: " + feature.geometry.coordinates[2] +
        "<br>Location: " + feature.properties.place
      );
    }
  }).addTo(earthquakes);  // use .addTo to add the L.geoJson object to the earthquakes LayerGroup

  // Then we add the earthquake layer to our map.
  earthquakes.addTo(myMap); // use .addTo to add the earthquakes LayerGroup to the myMap object

  // Create a dynamic legend that describes the color scheme for the circles
  // see this tutorial for guidance: https://www.igismap.com/legend-in-leafletjs-map-with-topojson/
  var legend = L.control({position: "bottomright"})
  
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 25, 50, 75, 100];
    var colors = [
      "#C4DAB5",
      "#A8CF8F",
      "#80BB5B",
      "#569F29",
      "#327F01"
    ];
  
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(myMap);

  // BONUS
  // Make another d3.json() call to the tectonic plates API endpoint
  // then fire off an anonymous function that takes a single argument plateData
  // YOUR_CODE_HERE {
      // Create an L.geoJson() that reads the plateData, and sets some options per your choosing 
      // YOUR_CODE_HERE
      // .YOUR_CODE_HERE; // use .addTo() to add the l.geoJson layer to the tectonicPlates LayerGroup

      // Then add the tectonicplates layer to the map.
      // YOUR_CODE_HERE; // use .addTo to add the tectonicPlates LayerGroup to the myMap object
    // });
});
