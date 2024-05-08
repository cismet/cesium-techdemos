import * as Cesium from "cesium";

export const lockPosition = async (viewer) => {
  const { center, camera, cameraHeight } = await getAll(viewer);
  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  // viewer.scene.camera.lookAtTransform(
  //   transform,
  //   new Cesium.HeadingPitchRange(0, -Math.PI / 4, cameraHeight - 150)
  // );

  viewer.scene.camera.lookAt(
    center,
    // new Cesium.HeadingPitchRange(0, -Math.PI / 4, cameraHeight)
    new Cesium.HeadingPitchRange(camera.heading, camera.pitch, cameraHeight)
  );

  const debugPrimitive = new Cesium.DebugModelMatrixPrimitive({
    modelMatrix: transform,
    length: 100000.0,
  });
  viewer.debugPrimitive = debugPrimitive;
  viewer.scene.primitives.add(debugPrimitive);
};

export const unlockPosition = async (viewer) => {
  viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  if (viewer.debugPrimitive) {
    viewer.scene.primitives.remove(viewer.debugPrimitive);
    viewer.debugPrimitive = undefined;
  }
};

export const getAll = async (viewer) => {
  const camera = viewer.camera;

  const ellipsoid = viewer.scene.mapProjection.ellipsoid;

  const windowPosition = new Cesium.Cartesian2(
    viewer.container.clientWidth / 2,
    viewer.container.clientHeight / 2
  );
  const cameraHeight = ellipsoid.cartesianToCartographic(
    camera.positionWC
  ).height;
  var pickRay = viewer.scene.camera.getPickRay(windowPosition);
  var pickPosition = viewer.scene.globe.pick(pickRay, viewer.scene);
  var pickPositionCartographic =
    viewer.scene.globe.ellipsoid.cartesianToCartographic(pickPosition);
  const lat = pickPositionCartographic.latitude * (180 / Math.PI);
  const lng = pickPositionCartographic.longitude * (180 / Math.PI);
  var positions = [Cesium.Cartographic.fromDegrees(lng, lat)];
  const heights = await Cesium.sampleTerrainMostDetailed(
    viewer.terrainProvider,
    positions
  );
  console.log("heights", heights[0].height);

  const terrainHeight = heights[0].height;

  var center = Cesium.Cartesian3.fromDegrees(lng, lat, terrainHeight);

  return {
    camera,
    ellipsoid,
    windowPosition,
    cameraHeight,
    center,
    lat,
    lng,
  };
};
