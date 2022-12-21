import { CesiumTerrainProvider, Color } from "cesium";
import * as Cesium from "cesium";
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "leaflet/dist/leaflet.css";
// export const mapProjection = new Cesium.WebMercatorProjection();

export const initializeCesium = (
  viewer,
  viewerprops,
  home,
  postInit = () => {}
) => {
  const scene = viewer.scene;
  if (scene.skyBox && scene.skyBox.destroy) {
    scene.skyBox.destroy();
    scene.skyBox = undefined;
  }

  scene.backgroundColor = Color.WHITE.clone();
  try {
    viewer._cesiumWidget._creditContainer.parentNode.removeChild(
      viewer._cesiumWidget._creditContainer
    );
  } catch (error) {}
  viewer.terrainProvider = new CesiumTerrainProvider({
    url: "https://cesium-wupp-terrain.cismet.de/terrain2020",
    format: "image/png",
  });

  const wuppOrtho = new Cesium.WebMapServiceImageryProvider({
    url: "https://maps.wuppertal.de/deegree/wms",
    layers: "R102:trueortho2022",
    format: "image/png",
    enablePickFeatures: false,
    //tilingScheme: new Cesium.WebMercatorTilingScheme(),
  });

  viewer.scene.globe.baseColor = Cesium.Color.BLACK;
  //viewer.mapProjection = mapProjection;
  // viewer.sceneMode = Cesium.SceneMode.COLUMBUS_VIEW;

  viewer.imageryLayers.addImageryProvider(wuppOrtho);

  viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;

  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(home);
  viewer.scene.camera.lookAtTransform(
    transform,
    new Cesium.HeadingPitchRange(0, -Math.PI / 4, 500)
  );

  // problematic since it slides above ground when zooming further in
  // viewer.scene.screenSpaceCameraController.minimumZoomDistance = 400;
  // viewer.scene.screenSpaceCameraController.maximumZoomDistance = 5000;
  // scene.screenSpaceCameraController.minimumZoomRate = 300;

  // from https://github.com/CesiumGS/cesium/issues/3984#issuecomment-288031904
  const camera = viewer.camera;
  camera.percentageChanged = 0;

  const minZoom = viewerprops?.minZoom || 400; // m
  const maxZoom = viewerprops?.maxZoom || 5000;
  let lastCamPos = camera.positionCartographic.clone();
  if (!viewerprops?.disableZoomRestrictions) {
    const listener = () => {
      const camHeight = camera.positionCartographic.height;
      // console.log("camHeight", camHeight);

      let isOutsideZoomLimits = false;
      let destHeight;
      if (camHeight < minZoom) {
        isOutsideZoomLimits = true;
        destHeight = minZoom;
      } else if (camHeight > maxZoom) {
        isOutsideZoomLimits = true;
        destHeight = maxZoom;
      }
      if (isOutsideZoomLimits) {
        const dest = Cesium.Cartesian3.fromRadians(
          lastCamPos.longitude, // ← previous coordinates
          lastCamPos.latitude,
          destHeight
        );
        camera.position = dest;
      }
      lastCamPos = camera.positionCartographic.clone();
    };
    const removeListener = camera.changed.addEventListener(listener);
  }
  postInit(viewer);
};
