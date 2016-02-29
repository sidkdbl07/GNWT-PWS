if (Meteor.isClient) {
  var buildings, markers;
  var defaultMarker = L.AwesomeMarkers.icon({
      icon: 'star',
      prefix: 'ion',
      markerColor: 'blue'
  });

  var greenMarker = L.AwesomeMarkers.icon({
      icon: 'star',
      prefix: 'ion',
      markerColor: 'green'
  });

  var redMarker = L.AwesomeMarkers.icon({
      icon: 'star',
      prefix: 'ion',
      markerColor: 'red'
  });

  var yellowMarker = L.AwesomeMarkers.icon({
      icon: 'star',
      prefix: 'ion',
      markerColor: 'orange'
  });

  var pinkMarker = L.AwesomeMarkers.icon({
      icon: 'star',
      prefix: 'ion',
      markerColor: 'pink'
  });

  var brownMarker = L.AwesomeMarkers.icon({
      icon: 'star',
      prefix: 'ion',
      markerColor: 'purple'
  });

  var ColorMarkers = new Array(greenMarker, redMarker, yellowMarker, pinkMarker, brownMarker);

  Meteor.subscribe("buildings");

  Template.buildings_map.onRendered(function() {
    buildings = Buildings.find().fetch();
    markers = [];
    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

    var map = L.map('map').setView([buildings[0].location.coordinates[1], buildings[0].location.coordinates[0]], 5);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var index = 0;

    for(let building of buildings) {
      markers[index++] = L.marker([building.location.coordinates[1], building.location.coordinates[0]], {icon: defaultMarker, title: building.name, region: building.region}).addTo(map)
        .bindPopup(building.name);
    }

    $(".leaflet-map").height($("#map_wrapper").height() - 46).width($("#map_wrapper").width());
    $("#map").height($("#map_wrapper").height() - 46).width($("#map_wrapper").width());
    map.invalidateSize();
  });

  var Colorize = function() {
    for(let marker of markers) {
      marker.setIcon(defaultMarker);
    }
  };

  var Decolorize = function() {
    let region_table = new Map();
    let color_index = 0;
    for(let marker of markers) {
      if(!region_table.has(marker.options.region)) {
        region_table.set(marker.options.region, ColorMarkers[(color_index++) % ColorMarkers.length]);
      }
      marker.setIcon(region_table.get(marker.options.region));
    }
  };

  Template.buildings_map.helpers({
    'all_buildings': function() {
      return Buildings.find().fetch();
    }
  });

  Template.buildings_map.events({
    'click #color_btn': function() {
      $('#color_btn').text(function(i, text) {
        if(text === 'Colorize')
        {
          Decolorize();
          return 'Decolorize';
        }
        else
        {
          Colorize();
          return 'Colorize';
        }
      });


    }
  });
}
