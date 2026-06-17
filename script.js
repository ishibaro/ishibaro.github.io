// ==========================================
// 1. GESTIÓN DE TEMAS (DARK / LIGHT)
// ==========================================
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const checkbox = document.getElementById('checkbox'); // <-- Agregado para corregir el ReferenceError

const applyStoredTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${savedTheme}-theme`);
    
    // Sincronizar el estado físico del checkbox si existe en la página
    if (checkbox) {
        checkbox.checked = (savedTheme === 'dark');
    }
};

if (checkbox) {
    checkbox.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyStoredTheme();
    });
}

// ==========================================
// 2. SISTEMA MULTI-IDIOMA PERSISTENTE
// ==========================================
function setLanguage(lang) {
    // Guardar la elección en el almacenamiento del navegador
    localStorage.setItem('selectedLanguage', lang);

    // Aplicar el atributo al body para que el CSS actúe de inmediato
    document.body.setAttribute('data-lang', lang);
    
    // Actualizar dinámicamente las clases activas en los botones del menú
    const buttons = document.querySelectorAll('.nav-lang-btn');
    buttons.forEach(btn => {
        if (btn.innerText.trim().toLowerCase() === lang.toLowerCase()) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Inicialización global al cargar cualquier documento
document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
    
    // Recuperar el idioma guardado o usar inglés por defecto
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(savedLang);
});

// ==========================================
// 3. MAPBOX (Protegido contra páginas sin mapa)
// ==========================================
// Mapbox

if (document.getElementById('map')) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXNoaWJhIiwiYSI6ImNtcWkxNjR0MTAxb2oyc3NoM2dwaWVvcHEifQ.Aqg0n4gT7SxaW17ikivj2A';

    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/standard',
        center: [-98.23188808, 21.31360567], // lon,lat
        zoom: 7,
        pitch: 55,
        bearing: 0.6,
        config: {
            // Initial configuration for the Mapbox Standard style set above. By default, its ID is `basemap`.
            basemap: {
                // Here, we're enabling all of the 3D layers such as landmarks, trees, and 3D extrusions.
                show3dObjects: true
            }
        }
    });

    map.on('style.load', () => {
        let today = new Date();
        // let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let time = today.getHours();
        console.log(time);
        let light = null;
        // use switch to control the lighting depending on user time
            switch (true){
                // to improve the code here I could focus?
            case time>=7 && time<=17:
                    light = "day";
                break
            case time>20 && time<24:
                    light = "night";
                break
            case time>0 && time<5:
                    light = "night";
                break
            case time>17 && time<20:
                    light = "dusk";
                break
            case time>5 && time<7:
                    light = "dawn";
                break
            }

            map.setConfigProperty('basemap', 'lightPreset', light);

            // use an expression to transition some properties between zoom levels 11 and 13, preventing visibility when zoomed out
            const zoomBasedReveal = (value) => {
                return [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    11,
                    0.0,
                    13,
                    value
                ];
            };

            // map.setRain({
            //     density: zoomBasedReveal(0.5),
            //     intensity: 1.0,
            //     color: '#a8adbc',
            //     opacity: 0.7,
            //     vignette: zoomBasedReveal(1.0),
            //     'vignette-color': '#464646',
            //     direction: [0, 80],
            //     'droplet-size': [2.6, 18.2],
            //     'distortion-strength': 0.7,
            //     'center-thinning': 0 // Rain to be displayed on the whole screen area
            // });

            map.addSource('polygons', { //name of source within this script
                "url": "mapbox://ishiba.4vp8grbd",
                "type": "vector"
            });

            map.addSource('lines', { //name of source within this script
                "url": "mapbox://ishiba.85nzjn6p",
                "type": "vector"
            });

            map.addLayer({
                "id": "grid-test-7e830z",
                "type": "fill",
                "source": "polygons", //here you call the source, in this case polygons is binded via JSON to mapbox://ishiba.4vp8grbd
                "source-layer": "grid_test-7e830z", // which in turn has this source layer, but this name comes directly from mapbox
                "layout": {},
                "paint": {
                    "fill-color": "hsla(0, 100.00%, 50.00%, 0.00)",
                    "fill-outline-color": "hsl(0, 0%, 0%)",
                    "fill-emissive-strength": 30
                }
            }); 

            map.addLayer({
                "id": "testy2-bgjkh1",
                "type": "line",
                "source": "lines",
                "source-layer": "testy2-bgjkh1",
                "layout": {},
                "paint": {"line-width": 3}
            });

            map.loadImage(
            'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
            (error, image) => {
                if (error) throw error;
                map.addImage('custom-marker', image);
                // Add a GeoJSON source with 2 points
                map.addSource('points', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                // feature for Mapbox DC
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [
                                        -98.03238901390978, 21.913188059745586
                                    ]
                                },
                                'properties': {
                                    'title': 'Bespoke'
                                }
                            },
                            {
                                // feature for Mapbox SF
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-98.414, 20.776]
                                },
                                'properties': {
                                    'title': 'solutions!'
                                }
                            }
                        ]
                    }
                });

                // Add a symbol layer
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'points',
                    'layout': {
                        'icon-image': 'custom-marker',
                        // get the title name from the source's "title" property
                        'text-field': ['get', 'title'],
                        'text-font': [
                            'Open Sans Semibold',
                            'Arial Unicode MS Bold'
                        ],
                        'text-offset': [0, 2], //label position offset
                        'text-anchor': 'center', //label position relative to point (notice that the centre of this pushpint is the bottom!)
                    },
                    "paint": {
                        "text-size": 28, // text labels size and colour
                        "text-color": "#fff", // text labels size and colour
                        "text-halo-color": "#ff0000" 
                    }
                });
            }
        );

        });
    }

// Menu Responsivo
function ResponsiveNav() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}
