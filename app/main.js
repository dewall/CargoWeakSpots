require([
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/widgets/Legend",
    "esri/layers/FeatureLayer",
    "esri/WebMap",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleLineSymbol",
    "app/utils/SliderUtils",
    "dojo/domReady!"
], function(Map, MapView, SceneView, Legend, FeatureLayer, WebMap, SimpleRenderer, SimpleLineSymbol) {

    var coloredRenderer = new SimpleRenderer({
        symbol: new SimpleLineSymbol({
            width: 1,
            color: [64, 255, 0]
        }),
        visualVariables: [{
            type: "color",
            field: "VSumGes",
            stops: [{
                value: 0,
                color: "green"
            }, {
                value: 5000,
                color: "yellow"
            }, {
                value: 25000,
                color: "red"
            }]
        }]
    });


    var fl2 = new FeatureLayer({
        url: "http://services.arcgis.com/CHWy5Vg5bILt6ufC/arcgis/rest/services/DBhackathonGrunddaten_WFL/FeatureServer/1",
        renderer: coloredRenderer,
        popupEnabled: false
    });

    var map = new Map({
        basemap: "dark-gray",
        layers: [fl2]
    });

    var webmap = new WebMap({
        portalItem: {
            id: "e691172598f04ea8881cd2a4adaa45ba"
        }
    });

    var sceneView = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            position: {
                latitude: 32.24237,
                longitude: 7.72943,
                z: 1534560
            },
            tilt: 45,
            heading: 0
        }
    });
    sceneView.environment.atmosphere.quality = "high";

    var mapView = new MapView({
        container: "viewDiv",
        map: map
    });

    var legend = new Legend({
        view: sceneView
    });

    sceneView.add(legend, "bottom-right");

});
