const viewer = new Cesium.Viewer("cesiumContainer", {
  //  sceneMode: Cesium.SceneMode.COLUMBUS_VIEW,
  imageryProvider: false,
  timeline: false,
  homeButton: false,
  geocoder: false,
  sceneModePicker: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  animation: false,
  navigationHelpButton: false,
});
viewer.imageryProvider = false;
const scene = viewer.scene;
if (scene.skyBox && scene.skyBox.destroy) {
  scene.skyBox.destroy();
}
scene.skyBox = undefined;

const home = Cesium.Cartesian3.fromDegrees(7.20009, 51.272034, 150);
const mapProjection = new Cesium.WebMercatorProjection();

scene.backgroundColor = Cesium.Color.WHITE.clone();
viewer.mapProjection = mapProjection;

viewer.sceneMode = Cesium.SceneMode.COLUMBUS_VIEW;
const transform = Cesium.Transforms.eastNorthUpToFixedFrame(home);
viewer.scene.camera.lookAtTransform(
  transform,
  new Cesium.HeadingPitchRange(0, -Math.PI / 4, 500)
);

const wuppOrtho = new Cesium.WebMapServiceImageryProvider({
  url: "https://maps.wuppertal.de/deegree/wms",
  layers: "R102:trueortho2022",
  format: "image/png",
  enablePickFeatures: false,
  tilingScheme: new Cesium.WebMercatorTilingScheme(),
});

viewer.imageryLayers.addImageryProvider(wuppOrtho);

const heightOffset = 0;
var surface = Cesium.Cartesian3.fromRadians(7.20009, 51.272034, 0.0);
var offset = Cesium.Cartesian3.fromRadians(7.20009, 51.272034, heightOffset);
var translation = Cesium.Cartesian3.subtract(
  offset,
  surface,
  new Cesium.Cartesian3()
);

const modelMatrix = Cesium.Matrix4.fromTranslation(translation);
var tileset = new Cesium.Cesium3DTileset({
  url: "https://wupp-3d-data.cismet.de/mesh/tileset.json",
});
viewer.scene.primitives.add(tileset);

viewer.scene.screenSpaceCameraController.minimumZoomDistance = 400;
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 5000;
