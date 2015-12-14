var map = L.map('map', {minZoom: 11}).setView([40.646782579355886, -8.687095642089844], 11);
map.setMaxBounds([[40.760260692426165, -8.276824951171875], [40.499703081749566, -8.955917358398438]]);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.tileLayer.wms("http://localhost:8080/geoserver/GDI/wms", {
    layers: 'GDI:aveiro',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map);


var nominating = new L.Control.Geocoder.Nominatim({
    serviceUrl:'http://nominatim.openstreetmap.org/',
    geocodingQueryParams: {
        countrycodes:'pt'
    }});

var geocoder = new L.Control.Geocoder({geocoder: nominating}).addTo(map);

geocoder.markGeocode = function(result) {
    var bbox = result.bbox;
    map.fitBounds(bbox);
};

var wfs = L.WFS('http://localhost:8080/geoserver/GDI/ows', {namespace: 'GDI'});

var data = [
    {featureLayer: {}, layer: 'secundary_schools', color: '#F5C66A', name: 'Escolas Secundárias'},
    {featureLayer: {}, layer: 'supermarket', color: '#6AF5D1', name: 'Super-Mercados'},
    {featureLayer: {}, layer: 'restaurant', color: '#F74242', name: 'Restaurantes'},
    {featureLayer: {}, layer: 'nursery', color: '#191CC7', name: 'Infantários'},
    {featureLayer: {}, layer: 'loja_conveniencia', color: '#FFF67A', name: 'Lojas de Conveniência'},
    {featureLayer: {}, layer: 'university', color: '#249D35', name: 'Universidades'},
    {featureLayer: {}, layer: 'farmacy', color: '#A86AF5', name: 'Farmácias'}
], buildingLayers = {};

wfs.getFeature(['house', 'apartments'], {}, function(result, error) {
    buildingLayers.layer = new L.geoJson(JSON.parse(result), {
        style: function(feature) {
            return {color: '#1C5019'};
        },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85});
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
        }
    });
});


for(var i = 0; i < data.length; i++) {
   callLayer(data[i]);
}


function callLayer(data) {
    wfs.getFeature([data.layer], {}, function(result, error) {
        data.featureLayer = new L.geoJson(JSON.parse(result), {
            style: function(feature) {
                return {color: data.color};
            },
            pointToLayer: function(feature, latlng) {
                return new L.marker(latlng, {
                    icon: new L.divIcon({className: data.layer + ' my-custom-icon pulsate'})
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.name);
            }
        });
    });
}


var MyCustomMarker = L.Icon.extend({
    options: {
        iconUrl: '/public/images/work.png',
        shadowUrl: null,
        iconAnchor: new L.Point(12, 12),
        iconSize: new L.Point(24, 24)
    }
});

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var options = {
    position: 'topright',
    draw: {
        polyline: false,
        polygon: false,
        circle: false,
        rectangle: false,
        marker: {
            icon: new MyCustomMarker()
        }
    },
    edit: {
        featureGroup: drawnItems
    }
};

var drawControl = new L.Control.Draw(options),
    legend = new L.control.customLayer({
        features: data,
        closestPoints: drawnItems,
        buildingLayer: buildingLayers
    });

map.addControl(drawControl);

map.on('draw:created', function (e) {
    if(drawnItems.getLayers().length === 0) {
        legend.addTo(map);
    }
    drawnItems.addLayer(e.layer);
    legend.auxLayer.addLayer(e.layer);
});

map.on('draw:deleted', function(e) {
    drawnItems.removeLayer(e.layer);
    legend.auxLayer.removeLayer(e.layer);
    if(drawnItems.getLayers().length === 0) {
        map.removeControl(legend);
    }
})
