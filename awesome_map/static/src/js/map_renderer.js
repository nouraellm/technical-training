odoo.define('awesome_map.MapRenderer', function (require) {
"use strict";

const AbstractRenderer = require('web.AbstractRenderer');

const MapRenderer = AbstractRenderer.extend({
    className: "o_map_view",

    /**
     * @override
     */
    init: function () {
        this._super.apply(this, arguments);
        this.mapInitialized = false;
    },
    /**
     * Initializes the map on the on_attach_callback hook, as the library
     * requires the container to be in the DOM to properly render the map.
     *
     * @override
     */
    on_attach_callback: function () {
        this._initializeMap();
        this._renderDataPoints();
        this._super.apply(this, arguments);
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Initializes the map. Ensures that this is done only once.
     *
     * @private
     */
    _initializeMap: function () {
        if (this.mapInitialized) {
            return;
        }
        this.mapInitialized = true;

        const initialLat = this.state[0] ? this.state[0].latitude : 51.505;
        const initialLong = this.state[0] ? this.state[0].longitude : -0.09;
        const options = { zoomControl: false };
        this.leafletMap = L.map(this.el, options).setView([initialLat, initialLong], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.leafletMap);
    },
    /**
     * Renders the data points on the map.
     *
     * @private
     */
    _renderDataPoints: function () {
        _.each(this.state, point => {
            L.marker([point.latitude, point.longitude]).addTo(this.leafletMap);
        });
    },
});

return MapRenderer;

});
