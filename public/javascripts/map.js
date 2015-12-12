var map = L.map('map', {minZoom: 11}).setView([40.646782579355886, -8.687095642089844], 11);
map.setMaxBounds([[40.760260692426165, -8.276824951171875], [40.499703081749566, -8.955917358398438]]);

var nominating = new L.Control.Geocoder.Nominatim({
    serviceUrl:'http://nominatim.openstreetmap.org/',
    geocodingQueryParams: {
        countrycodes:'pt'
    }});
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var nexrad = L.tileLayer.wms("http://localhost:8080/geoserver/GDI/wms", {
    layers: 'GDI:aveiro',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map);

var geocoder = new L.Control.Geocoder({geocoder: nominating}).addTo(map);

var marker;
map.on('click', function(e) {
    nominating.reverse(e.latlng, map.options.crs.scale(map.getZoom()), function(results) {
        var r = results[0];
        if (r) {
            if (marker) {
                marker.
                setLatLng(r.center).
                setPopupContent(r.html || r.name).
                openPopup();
            } else {
                marker = L.marker(r.center).bindPopup(r.name).addTo(map).openPopup();
            }
        }
    })
});

var wfs = L.WFS('http://localhost:8080/geoserver/GDI/ows', {namespace: 'GDI'});

var secundarySchools, supermarkets, restaurants, convenienceStores, universities, pharmacies, houses, apartments;
wfs.getFeature(['secundary_schools'], {}, function(result, error) {
    secundarySchools = new L.geoJson(JSON.parse(result));
    map.addLayer(secundarySchools);
});

wfs.getFeature(['supermarket'], {}, function(result, error) {
    supermarkets = new L.geoJson(JSON.parse(result));
    map.addLayer(supermarkets);
});
wfs.getFeature(['restaurant'], {}, function(result, error) {
    restaurants = new L.geoJson(JSON.parse(result));
    map.addLayer(restaurants);
});


wfs.getFeature(['loja_conveniencia'], {}, function(result, error) {
    convenienceStores = new L.geoJson(JSON.parse(result));
    map.addLayer(convenienceStores);
});

wfs.getFeature(['university'], {}, function(result, error) {
    universities = new L.geoJson(JSON.parse(result));
    map.addLayer(universities);
});

wfs.getFeature(['farmacy'], {}, function(result, error) {
    pharmacies = new L.geoJson(JSON.parse(result));
    map.addLayer(pharmacies);
});

wfs.getFeature(['house'], {}, function(result, error) {
    houses = new L.geoJson(JSON.parse(result));
    map.addLayer(houses);
});

wfs.getFeature(['apartments'], {}, function(result, error) {
    apartments = new L.geoJson(JSON.parse(result));
    map.addLayer(apartments);
});
