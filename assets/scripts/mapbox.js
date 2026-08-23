/* ============================================
   mapbox.js — Mapbox GL JS initialization
   Only loads on pages that have #map element.
   ============================================ */

(function () {
    'use strict';

    if (!document.getElementById('map')) return;
    if (typeof mapboxgl === 'undefined') {
        console.warn('mapbox.js: mapboxgl not loaded.');
        return;
    }

    // ⚠️  Public token — restrict to your domain in Mapbox dashboard
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXNoaWJhIiwiYSI6ImNtcWkxNjR0MTAxb2oyc3NoM2dwaWVvcHEifQ.Aqg0n4gT7SxaW17ikivj2A';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/standard',
        center: [-98.23188808, 21.31360567],
        zoom: 7,
        pitch: 55,
        bearing: 0.6,
        config: {
            basemap: { show3dObjects: true }
        }
    });

    map.on('style.load', () => {

        // Dynamic lighting based on local time
        const hour = new Date().getHours();
        let light;
        if      (hour >= 7  && hour <= 17) light = 'day';
        else if (hour > 17  && hour < 20)  light = 'dusk';
        else if (hour >= 5  && hour < 7)   light = 'dawn';
        else                               light = 'night';

        map.setConfigProperty('basemap', 'lightPreset', light);

        // Zoom-based reveal expression
        const zoomReveal = (value) => [
            'interpolate', ['linear'], ['zoom'], 11, 0.0, 13, value
        ];

        // Vector sources
        map.addSource('polygons', { type: 'vector', url: 'mapbox://ishiba.4vp8grbd' });
        map.addSource('lines',    { type: 'vector', url: 'mapbox://ishiba.85nzjn6p' });

        map.addLayer({
            id: 'grid-test-7e830z',
            type: 'fill',
            source: 'polygons',
            'source-layer': 'grid_test-7e830z',
            paint: {
                'fill-color': 'hsla(0,100%,50%,0)',
                'fill-outline-color': 'hsl(0,0%,0%)',
                'fill-emissive-strength': 30
            }
        });

        map.addLayer({
            id: 'testy2-bgjkh1',
            type: 'line',
            source: 'lines',
            'source-layer': 'testy2-bgjkh1',
            paint: { 'line-width': 3 }
        });

        // Custom markers
        map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (err, img) => {
            if (err) throw err;
            map.addImage('custom-marker', img);
            map.addSource('points', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: [-98.03238901390978, 21.913188059745586] },
                            properties: { title: 'Bespoke' }
                        },
                        {
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: [-98.414, 20.776] },
                            properties: { title: 'solutions!' }
                        }
                    ]
                }
            });

            map.addLayer({
                id: 'points',
                type: 'symbol',
                source: 'points',
                layout: {
                    'icon-image': 'custom-marker',
                    'text-field': ['get', 'title'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, 2],
                    'text-anchor': 'center'
                },
                paint: {
                    'text-size': 28,
                    'text-color': '#fff',
                    'text-halo-color': '#ff0000'
                }
            });
        });
    });
})();
