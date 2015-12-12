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

var secundarySchools, supermarkets, restaurants, convenienceStores, universities, pharmacies, houses, apartments, nurceries;
wfs.getFeature(['secundary_schools'], {}, function(result, error) {
    secundarySchools = new L.geoJson(JSON.parse(result), {
        style: function(feature) {
            return {color: '#F5C66A'};
        },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85});
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
        }
    });
    map.addLayer(secundarySchools);
});

wfs.getFeature(['supermarket'], {}, function(result, error) {
    supermarkets = new L.geoJson(JSON.parse(result), {
        style: function(feature) {
            return {color: '#6AF5D1'};
        },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85});
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
        }
    });
    map.addLayer(supermarkets);
});
wfs.getFeature(['restaurant'], {}, function(result, error) {
    restaurants = new L.geoJson(JSON.parse(result), {
        style: function(feature) {
            return {color: '#F74242'};
        },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85});
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
        }
    });
    map.addLayer(restaurants);
});


wfs.getFeature(['loja_conveniencia'], {}, function(result, error) {
    convenienceStores = new L.geoJson(JSON.parse(result), {
        style: function(feature) {
            return {color: '#FFF67A'};
        },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85});
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
        }
    });
    map.addLayer(convenienceStores);
});

wfs.getFeature(['university'], {}, function(result, error) {
    universities = new L.geoJson(JSON.parse(result), {
        style: function(feature) {
            return {color: '#249D35'};
        },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85});
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
        }
    });
    map.addLayer(universities);
});

wfs.getFeature(['farmacy'], {}, function(result, error) {
    pharmacies = new L.geoJson(JSON.parse(result), {
        style: function(feature) {
            return {color: '#A86AF5'};
        },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85});
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
        }
    });
    map.addLayer(pharmacies);
});

wfs.getFeature(['nursery'], {}, function(result, error) {
    nurceries = new L.geoJson(JSON.parse(result), {
        style: function(feature) {
            return {color: '#191CC7'};
        },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85});
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
        }
    });
    map.addLayer(nurceries);
});



wfs.getFeature(['house'], {}, function(result, error) {
    houses = new L.geoJson(JSON.parse(result), {
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

wfs.getFeature(['apartments'], {}, function(result, error) {
    apartments = new L.geoJson(JSON.parse(result), {
        style: function(feature) {
            return {color: '#AFCAFF'};
        },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85});
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
        }
    });
});


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        data = [
            {color: '#F5C66A', name: 'Escolas Secundárias'},
            {color: '#6AF5D1', name: 'Super-Mercados'},
            {color: '#F74242', name: 'Restaurantes'},
            {color: '#191CC7', name: 'Infantários'},
            {color: '#FFF67A', name: 'Lojas de Conveniência'},
            {color: '#249D35', name: 'Universidades'},
            {color: '#A86AF5', name: 'Farmácias'}
        ];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < data.length; i++) {
        div.innerHTML += '<i style="background:' + data[i].color + '"></i> &ndash;&nbsp;' + data[i].name + '<br>';
    }

    return div;
};

legend.addTo(map);