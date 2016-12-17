require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/symbols/SimpleLineSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/renderers/ClassBreaksRenderer",
    "esri/dijit/HorizontalSlider",
    "esri/renderers/smartMapping",
    "esri/dijit/ClassedColorSlider",
    "esri/dijit/ColorInfoSlider",
    "esri/plugins/FeatureLayerStatistics",
    "dijit/registry",
    "dojox/form/RangeSlider",
    "dojo/_base/Color",
    "dojo/dom",
    "dojo/on",
    "dojo/domReady!"
], function(Map, FeatureLayer, SimpleLineSymbol, SimpleRenderer, ClassBreaksRenderer, HorizontalSlider, smartMapping, ClassedColorSlider, ColorInfoSlider, FeatureLayerStatistics, registry, RangeSlider, Color, dom, on) {
    var map = new Map("viewDiv", {
        basemap: "dark-gray",
        center: [10.198198, 51.310202],
        zoom: 7
    });
    // Carbon storage of trees in Warren Wilson College.
    var symbol = new SimpleLineSymbol();
    symbol.setColor(new Color([150, 150, 150, 0.5]));
    symbol.setWidth(3);

    // var renderer = new SimpleRenderer({
    //     symbol: sls
    // });

    var colorInfoSlider = new ColorInfoSlider({
        colorInfo: {
            stops: [{
                color: new Color("#FFFCD4"),
                value: 0.0001
            }, {
                color: new Color("#FFFCD4"),
                value: 1.0001
            }]
        }
    }, "esri-colorinfoslider");
    colorInfoSlider.startup();

    var renderer = new ClassBreaksRenderer(symbol, "VSumGes");
    renderer.addBreak(0, 2000, new SimpleLineSymbol().setColor(new Color([0, 255, 0, 0.5])));
    renderer.addBreak(5000, 10000, new SimpleLineSymbol().setColor(new Color([255, 255, 0, 0.5])));
    renderer.addBreak(10000, 20000, new SimpleLineSymbol().setColor(new Color([255, 0, 0, 0.5])));

    var featureLayer = new FeatureLayer("http://services.arcgis.com/CHWy5Vg5bILt6ufC/arcgis/rest/services/DBhackathonGrunddaten_WFL/FeatureServer/1", {
        mode: FeatureLayer.MODE_AUTO,
        outFields: "*"
    });
    var featureLayerStatistics = new FeatureLayerStatistics({
        layer: featureLayer,
        visible: true
    });


    featureLayer.setRenderer(renderer);

    map.addLayer(featureLayer);

    featureLayer.on("load", function() {
        map.addLayer(featureLayer);

        // featureLayer.setInfoTemplate(new InfoTemplate("${NAME} County, ${STATE_FIPS:FormatFIPSToStateAbbr()}", content));

        //ColorInfoSlider panel title
        dom.byId("title").innerHTML = "hallo";

        updateSmartMapping();
    });
    // setInterval(function() {
    //     renderer.breaks = [];
    //     renderer.addBreak(2000, 5000, new SimpleLineSymbol().setColor(new Color([255, 0, 255, 0.5])));
    //     renderer.addBreak(5000, 10000, new SimpleLineSymbol().setColor(new Color([255, 255, 0, 0.5])));
    //     renderer.addBreak(10000, 20000, new SimpleLineSymbol().setColor(new Color([255, 0, 0, 0.5])));
    //     featureLayer.redraw();
    // }, 2500);


    function updateSmartMapping() {

        smartMapping.createColorRenderer({
            layer: featureLayer,
            field: "VSumGes",
            basemap: "dark-gray",
            theme: "high-to-low"
        }).then(function(colorRenderer) {
            console.log(colorRenderer.renderer);
            featureLayer.setRenderer(colorRenderer.renderer);
            featureLayer.redraw();

            featureLayerStatistics.getHistogram({
                field: "VSumGes",
                numBins: 20
            }).then(function(histogram) {
                colorInfoSlider.set("colorInfo", colorRenderer.renderer.visualVariables[0]);
                colorInfoSlider.set("minValue", colorRenderer.statistics.min);
                colorInfoSlider.set("maxValue", colorRenderer.statistics.max);
                colorInfoSlider.set("statistics", colorRenderer.statistics);
                colorInfoSlider.set("histogram", histogram);
                colorInfoSlider.set("handles", [0, 4]);
                colorInfoSlider.set("primaryHandle", null);

                colorInfoSlider.on("handle-value-change", function(sliderValueChange) {
                    //console.log("handle-value-change", sliderValueChange);
                    featureLayer.renderer.setVisualVariables([sliderValueChange]);
                    featureLayer.redraw();
                });
            });
        })
    };
    // var variables = {
    //     "VSumGes": {
    //         name: "Gesamt",
    //         low: 0,
    //         mid: 5000,
    //         high: 25000
    //     },
    //     "FSumGes": {
    //         name: "Gesamt Fahrzeit",
    //         low: 0,
    //         mid: 50,
    //         high: 200,
    //     }
    // };
    //
    //
    // var coloredRenderer = new SimpleRenderer({
    //     symbol: new SimpleLineSymbol({
    //         width: 1,
    //         color: [64, 255, 0]
    //     }),
    //     visualVariables: [{
    //         type: "color",
    //         field: "VSumGes",
    //         stops: [{
    //             value: 0,
    //             color: "green"
    //         }, {
    //             value: 5000,
    //             color: "yellow"
    //         }, {
    //             value: 25000,
    //             color: "red"
    //         }]
    //     }]
    // });
    //
    // var coloredRenderer2 = new SimpleRenderer({
    //     symbol: new SimpleLineSymbol({
    //         width: 1,
    //         color: [64, 255, 0]
    //     }),
    //     visualVariables: [{
    //         type: "color",
    //         field: "FSumGes",
    //         stops: [{
    //             value: 0,
    //             color: "green"
    //         }, {
    //             value: 10,
    //             color: "yellow"
    //         }, {
    //             value: 100,
    //             color: "red"
    //         }]
    //     }]
    // });
    //
    //
    // var featureLayer = new FeatureLayer({
    //     url: "http://services.arcgis.com/CHWy5Vg5bILt6ufC/arcgis/rest/services/DBhackathonGrunddaten_WFL/FeatureServer/1",
    //     renderer: coloredRenderer2,
    //     popupEnabled: false
    // });
    //
    // var map = new Map({
    //     basemap: "dark-gray",
    //     layers: [featureLayer]
    // });
    //
    // var webmap = new WebMap({
    //     portalItem: {
    //         id: "e691172598f04ea8881cd2a4adaa45ba"
    //     }
    // });
    //
    // var sceneView = new SceneView({
    //     container: "viewDiv",
    //     map: map,
    //     camera: {
    //         position: {
    //             latitude: 32.24237,
    //             longitude: 7.72943,
    //             z: 1534560
    //         },
    //         tilt: 45,
    //         heading: 0
    //     }
    // });
    // sceneView.environment.atmosphere.quality = "high";
    //
    // var mapView = new MapView({
    //     container: "viewDiv",
    //     map: map
    // });
    //
    //
    // // sceneView.add(legend, "bottom-right");
    //
    // function initSelector() {
    //     var select = dom.byId("attSelect");
    //     for (var key in variables) {
    //         let value = variables[key];
    //         let option = document.createElement("option");
    //         option.text = value.name;
    //         option.value = key;
    //         select.add(option);
    //     }
    //  }
    //
    // on(dom.byId("attSelect"), "change", function(event) {
    //     console.log(event.target.value);
    //     var selected = variables[event.target.value];
    //     if (selected) {
    //         // featureLayer.renderer = new SimpleRenderer() {
    //         //
    //         // };
    //     }
    // });
    //
    // initSelector();

});
