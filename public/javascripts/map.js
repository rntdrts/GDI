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
    layers: 'GDI:teste',
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
})

