L.control.customLayer = L.Control.extend({
    options: {
        position: 'topright'
    },
    initialize: function(options) {
        L.Util.setOptions(this, options);
        this.layerSelection = new L.featureGroup();
        this.nearestBuildings = new L.featureGroup();
        this.auxLayer = new L.featureGroup();
    },
    onAdd: function(map) {
        map.addLayer(this.layerSelection);
        map.addLayer(this.nearestBuildings);
        this._map = map;
        this.container = L.DomUtil.create('div', 'info legend');
        var data = this.options.features;

        for (var i = 0; i < data.length; i++) {
            var checkbox = L.DomUtil.create('input'), iElement = L.DomUtil.create('i'), br = L.DomUtil.create('br');
            iElement.style.backgroundColor = data[i].color;
            checkbox.type = 'checkbox';
            checkbox.id = data[i].layer;
            var label = L.DomUtil.create('label');
            label.setAttribute('for', data[i].layer);
            label.innerText = data[i].name;
            this.container.appendChild(iElement);
            this.container.appendChild(checkbox);
            this.container.appendChild(label);
            this.container.appendChild(br);
            this._setEvents(checkbox, data[i]);
        }

        var button = L.DomUtil.create('button');
        button.innerText = 'Edificios mais perto';
        L.DomEvent.addListener(button, 'click', this.onButtonClick, this);

        this.container.appendChild(button);

        return this.container;
    },
    onRemove: function(map) {
        this.nearestBuildings.clearLayers();
        this.layerSelection.clearLayers();
        map.removeLayer(this.layerSelection);
        map.removeLayer(this.nearestBuildings);
    },
    _setEvents: function(checkbox, data) {
        L.DomEvent.addListener(checkbox, 'change', function(e) {
            this.update(e, data);
        }, this);

    },
    onButtonClick: function(e){
        this.nearestBuildings.clearLayers();
        var nearest = leafletKnn(this.options.buildingLayer.layer).nearest(this.auxLayer.getBounds().getCenter(), 300);
        for (var i = 0; i < nearest.length; i++) {
            this.nearestBuildings.addLayer(nearest[i].layer)
        }
    },
    update: function(e, data) {
        var nearest = leafletKnn(data.featureLayer).nearest(this.options.closestPoints.getBounds().getCenter(), 1);
        if (e.target.checked) {
            for (var i = 0; i < nearest.length; i++) {
                this.layerSelection.addLayer(nearest[i].layer);
                this.auxLayer.addLayer(nearest[i].layer)
            }
            data.selectedLayers = nearest;
        } else {
            for (var i = 0; i < data.selectedLayers.length; i++) {
                this.layerSelection.removeLayer(data.selectedLayers[i].layer);
                this.auxLayer.removeLayer(data.selectedLayers[i].layer)

            }
        }
    }
});