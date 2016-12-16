require([
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/widgets/Legend",
    "esri/layers/FeatureLayer",
    "esri/WebMap",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleLineSymbol",
    "dojo/dom",
    "dojo/on",
    "dojo/domReady!"
], function(Map, MapView, SceneView, Legend, FeatureLayer, WebMap, SimpleRenderer, SimpleLineSymbol, dom, on) {

    var variables = {
        "VSumGes": {
            name: "Gesamt",
            low: 0,
            mid: 5000,
            high: 25000
        },
        "FSumGes": {
            name: "Gesamt Fahrzeit",
            low: 0,
            mid: 50,
            high: 200,
        }
    };


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

    var coloredRenderer2 = new SimpleRenderer({
        symbol: new SimpleLineSymbol({
            width: 1,
            color: [64, 255, 0]
        }),
        visualVariables: [{
            type: "color",
            field: "FSumGes",
            stops: [{
                value: 0,
                color: "green"
            }, {
                value: 10,
                color: "yellow"
            }, {
                value: 100,
                color: "red"
            }]
        }]
    });


    var featureLayer = new FeatureLayer({
        url: "http://services.arcgis.com/CHWy5Vg5bILt6ufC/arcgis/rest/services/DBhackathonGrunddaten_WFL/FeatureServer/1",
        renderer: coloredRenderer2,
        popupEnabled: false
    });

    var map = new Map({
        basemap: "dark-gray",
        layers: [featureLayer]
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

    // sceneView.add(legend, "bottom-right");

    function initSelector() {
        var select = dom.byId("attSelect");
        for (var key in variables) {
            let value = variables[key];
            let option = document.createElement("option");
            option.text = value.name;
            option.value = key;
            select.add(option);
        }
    }

    on(dom.byId("attSelect"), "change", function(event) {
        console.log(event.target.value);
        var selected = variables[event.target.value];
        if (selected) {
            featureLayer.renderer = new SimpleRenderer() {

            };
        }
    });

    initSelector();

});
