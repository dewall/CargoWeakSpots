require([
    "esri/Map",
    "esri/views/SceneView"
], function(Map, SceneView) {

    var map = new Map({
        basemap: "dark-gray"
    });

    var view = new SceneView({
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

    view.environment.atmosphere.quality = "high";

    var legend = new Legend({
        view: view
    });

    view.ui.add(legend, "bottom-right");
});
