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
    "esri/InfoTemplate",
    "esri/dijit/Popup",
    "esri/dijit/PopupTemplate",
    "esri/geometry/Extent",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/tasks/GeometryService",
    "esri/tasks/query",
    "esri/dijit/LayerList",
    "dojo/dom-construct",
    "dojo/dom-class",
    "esri/dijit/LayerList",
    "dijit/registry",
    "dojox/form/RangeSlider",
    "dojo/_base/Color",

    "dojo/dom",
    "dojo/on",
    "dojo/domReady!"
], function(Map, FeatureLayer, SimpleLineSymbol, SimpleRenderer,
    ClassBreaksRenderer, HorizontalSlider, smartMapping, ClassedColorSlider,
    ColorInfoSlider, FeatureLayerStatistics, InfoTemplate, Popup,
    PopupTemplate, Extent, SimpleFillSymbol, SimpleLineSymbol,
    GeometryService, Query, LayerList, domConstruct, domClass,
    LayerList, registry, RangeSlider, Color, dom, on) {

    var selected = "VSumGes";
    var attributes = {
        "VSumGes": "Gesamte Verspätungen",
        "FSumGes": "Anzahl aller Fahrten",
        "VFFahrSum": "Verhältnis Verspätungen/Fahrten",
        "VSumJan": "Gesamte Verspätungen (Januar)",
        "FSumJan": "Anzahl aller Fahrten (Januar)",
        "VSumFeb": "Gesamte Verspätungen (Februar)",
        "FSumFeb": "Anzahl aller Fahrten (Februar)",
        "VSumMrz": "Gesamte Verspätungen (März)",
        "FSumMrz": "Anzahl aller Fahrten (März)",
        "VSumApr": "Gesamte Verspätungen (April)",
        "FSumApr": "Anzahl aller Fahrten (April)",
        "VSumMai": "Gesamte Verspätungen (Mai)",
        "FSumMai": "Anzahl aller Fahrten (Mai)",
        "VSumJun": "Gesamte Verspätungen (Juni)",
        "FSumJun": "Anzahl aller Fahrten (Juni)",
        "VSumJul": "Gesamte Verspätungen (Juli)",
        "FSumJul": "Anzahl aller Fahrten (Juli)",
        "VSumAug": "Gesamte Verspätungen (August)",
        "FSumAug": "Anzahl aller Fahrten (August)",
        "VSumSep": "Gesamte Verspätungen (September)",
        "FSumSep": "Anzahl aller Fahrten (September)",
        "VSumOkt": "Gesamte Verspätungen (Oktober)",
        "FSumOkt": "Anzahl aller Fahrten (Oktober)",
        "VSumNov": "Gesamte Verspätungen (November)",
        "FSumNov": "Anzahl aller Fahrten (November)"
    }

    var map = new Map("viewDiv", {
        basemap: "dark-gray",
        center: [10.198198, 51.310202],
        zoom: 7
    });
    // Carbon storage of trees in Warren Wilson College.
    var symbol = new SimpleLineSymbol();
    symbol.setColor(new Color([150, 150, 150, 0.5]));
    symbol.setWidth(5);

    var renderer = new SimpleRenderer({
        symbol: symbol
    });

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

    var featureLayer = new FeatureLayer("http://services.arcgis.com/CHWy5Vg5bILt6ufC/arcgis/rest/services/DBhackathon_Grunddaten_V2_extra_Download/FeatureServer/2", {
        outFields: "*"
    });
    var featureLayerStatistics = new FeatureLayerStatistics({
        layer: featureLayer,
        visible: true
    });
    var nullSegmentsFL = new FeatureLayer("http://services.arcgis.com/CHWy5Vg5bILt6ufC/arcgis/rest/services/StreckennetzCargoNull_Werte_Netz/FeatureServer/0");

    var popup = new Popup({
        fillSymbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]))
    }, domConstruct.create("div"));

    domClass.add(popup.domNode, "myTheme");

    var infoTemplate = setInfoTemplate(selected);

    featureLayer.setRenderer(renderer);

    // var layerList = new LayerList({
    //     map: map,
    //     showLegend: true,
    //     showSubLayers: false,
    //     showOpacitySlider: true,
    //     visibility: false,
    //     layers: [featureLayer]
    // }, "layerListContainer");
    // layerList.startup();

    map.addLayer(nullSegmentsFL);
    map.addLayer(featureLayer);

    featureLayer.on("load", function() {
        map.addLayer(featureLayer);

        // featureLayer.setInfoTemplate(new InfoTemplate("${NAME} County, ${STATE_FIPS:FormatFIPSToStateAbbr()}", content));

        //ColorInfoSlider panel title
        dom.byId("title").innerHTML = "Settings";

        updateSmartMapping();
    });



    function initSelector() {
        var select = dom.byId("attrib-selector");
        for (var key in attributes) {
            var value = attributes[key];
            var option = document.createElement("option");
            option.text = value;
            option.value = key;
            select.add(option);
        }
    }
    initSelector();

    function updateSmartMapping() {

        smartMapping.createColorRenderer({
            layer: featureLayer,
            field: "VSumGes",
            basemap: "dark-gray",
            theme: "high-to-low"
        }).then(function(colorRenderer) {
            console.log(colorRenderer.renderer);

            hackColorRamp(colorRenderer);

            featureLayer.setRenderer(colorRenderer.renderer);
            featureLayer.redraw();

            featureLayerStatistics.getHistogram({
                field: selected,
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

                    console.log("attributeValue");
                    featureLayer.redraw();
                });

                dom.byId("attrib-selector").onchange = function() {
                    selected = this.value;
                    smartMapping.createColorRenderer({
                        layer: featureLayer,
                        field: selected,
                        basemap: "dark-gray",
                        theme: "high-to-low"
                    }).then(function(colorRenderer) {
                        hackColorRamp(colorRenderer);

                        setInfoTemplate(selected);
                        //console.log("create color renderer is generated", colorRenderer);
                        featureLayer.setRenderer(colorRenderer.renderer);
                        featureLayer.redraw();

                        colorInfoSlider.set("colorInfo", colorRenderer.renderer.visualVariables[0]);
                        colorInfoSlider.set("minValue", colorRenderer.statistics.min);
                        colorInfoSlider.set("maxValue", colorRenderer.statistics.max);
                        colorInfoSlider.set("colorInfo", colorRenderer.renderer.visualVariables[0]);
                        colorInfoSlider.set("handles", [0, 4]);
                        colorInfoSlider.set("primaryHandle", null);

                    }).otherwise(function(error) {
                        console.log("Error: %o", error);
                        colorInfoSlider.showHistogram = false;
                    });
                };
            });
        })
    }


    function setInfoTemplate(attributeValue) {
        var infoTemplate;
        if (attributeValue.startsWith("V")){
             infoTemplate = new InfoTemplate("DB Cargo Verspätungen", attributes[attributeValue] + ": ${" + attributeValue + "}" + " Stunden");
        }
        else if(attributeValue.startsWith("F")){
             infoTemplate = new InfoTemplate("DB Cargo Fahrten", attributes[attributeValue] + ": ${" + attributeValue + "}");
        }
        else{
            infoTemplate = new InfoTemplate("Attribute", attributes[attributeValue] + ": ${" + attributeValue + "}");
        }
        featureLayer.infoTemplate = infoTemplate;
    }

    function hackColorRamp(colorRenderer) {
        var tmp = colorRenderer.renderer.visualVariables[0];

        // dirty hack
        colorRenderer.renderer.defaultSymbol.width = 3;
        colorRenderer.renderer._symbols["-9007199254740991-9007199254740991"].width = 3;

        tmp.stops[4].color = {
            a: 1,
            b: 0,
            g: 0,
            r: 255
        }

        tmp.stops[3].color = {
            a: 1,
            b: 0,
            g: 125,
            r: 255
        }

        tmp.stops[2].color = {
            a: 1,
            b: 0,
            g: 255,
            r: 255
        }

        tmp.stops[1].color = {
            a: 1,
            b: 0,
            g: 255,
            r: 125
        }

        tmp.stops[0].color = {
            a: 1,
            b: 0,
            g: 255,
            r: 0
        }
    }
});
