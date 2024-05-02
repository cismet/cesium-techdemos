import {
  faBars,
  faBox,
  faCube,
  faGlobe,
  faHouseUser,
  faInfo,
  faLock,
  faLockOpen,
  faRocket,
  faSquare,
  faSync,
  faVial,
  faVials,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllByAltText } from "@testing-library/react";
import {
  Cartesian3,
  CesiumTerrainProvider,
  Color,
  createWorldTerrain,
  Ion,
} from "cesium";
import * as Cesium from "cesium";
import {Matrix4} from "cesium";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Camera,
  CameraFlyTo,
  Cesium3DTileset,
  Entity,
  PointGraphics,
  Viewer,
} from "resium";
import styled, { css } from "styled-components";

/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import logo from "./logo.svg";

import "./App.css";
import "leaflet-fullscreen-custom-container-fork";
import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";

import "leaflet/dist/leaflet.css";

Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYzc4ZmZlNy1jNDU4LTQzZTYtOGJmZC01M2QxNzUwMTQxOTQiLCJpZCI6MTEwODcxLCJpYXQiOjE2NjU1NTk1NjF9.Yaxb7A6gyHGhBwDQcCVmEf7g10QNoyD1NIC2TWI4hBs";

const Button = styled.a`
  /* This renders the buttons above... Edit me! */
  background-image: url(images/command.png);
  width: 20px;
  height: 20px;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  display: block;
  padding: 3px;
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.65);
  cursor: auto;
  text-align: center;
  background-color: #ffffff;
`;
const mapProjection = new Cesium.WebMercatorProjection();
function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return { width: size[0], height: size[1] };
}
const getAll = async (viewer) => {
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
let debugPrimitive;

const lockPosition = async (viewer) => {
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

  debugPrimitive = new Cesium.DebugModelMatrixPrimitive({
    modelMatrix: transform,
    length: 100000.0,
  });
  viewer.scene.primitives.add(debugPrimitive);
};

const unlockPosition = async (viewer) => {
  viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  if (debugPrimitive) {
    viewer.scene.primitives.remove(debugPrimitive);
  }
};
function App() {
  const windowSize = useWindowSize();
  const home = Cesium.Cartesian3.fromDegrees(7.20009, 51.272034, 150);
  const position = Cartesian3.fromDegrees(7.20009, 51.2718, 155);
  const viewerRef = useRef(null);
  const tilesetRef = useRef(null);
  const activeRotationRef = useRef(null);

  const [meshVisible, setMeshVisible] = useState(true);
  const [activeRotation, setActiveRotation] = useState(false);
  const [lockCenter, setLockCenter] = useState(false);

  const [camPatameters, setCamPatameters] = useState({});

  const dev = process.env.NODE_ENV !== "production";
  useEffect(() => {
    activeRotationRef.current = activeRotation;
  }, [activeRotation]);

  // const extent = Rectangle.fromDegrees(117.940573, -29.808406, 118.313421, -29.468825);

  // Camera.DEFAULT_VIEW_RECTANGLE = extent;
  // Camera.DEFAULT_VIEW_FACTOR = 0;
  useEffect(() => {
    if (viewerRef?.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer
      console.log("viewer", viewer);
      const scene = viewer.scene;

      scene.skyBox.destroy();

      scene.skyBox = undefined;

      // scene.sun.destroy();

      // scene.sun = undefined;

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

      const provider = new Cesium.WebMapServiceImageryProvider({
        url: "https://maps.wuppertal.de/deegree/wms",
        layers: "R102:trueortho2022",
        format: "image/png",
        enablePickFeatures: false,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
      });

      const rain = new Cesium.WebMapServiceImageryProvider({
        url: "https://starkregen-wuppertal.cismet.de/geoserver/wms?",
        layers: "starkregen:S11_T50_depth",
        styles: "starkregen:depth",
        parameters: {
          transparent: "true",
          format: "image/png",
        },
        tilingScheme: new Cesium.WebMercatorTilingScheme(),

        enablePickFeatures: false,
      });

      viewer.scene.globe.baseColor = Cesium.Color.BLACK;
      viewer.mapProjection = mapProjection;
      viewer.sceneMode = Cesium.SceneMode.COLUMBUS_VIEW;

      viewer.imageryLayers.addImageryProvider(provider);
      viewer.imageryLayers.addImageryProvider(rain);

      viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;

      const transform = Cesium.Transforms.eastNorthUpToFixedFrame(home);
      viewer.scene.camera.lookAtTransform(
        transform,
        new Cesium.HeadingPitchRange(0, -Math.PI / 4, 500)
      );

      unlockPosition(viewer);

      // Create a new Cesium3DTileset object and pass it the URL of the tileset
      // tileset = new Cesium.Cesium3DTileset({
      //   url: "https://wupp-3d-data.cismet.de/mesh/tileset.json",
      // });

      // // Add the tileset to the viewer
      // viewer.scene.primitives.add(tileset);

      viewer.clock.onTick.addEventListener(function (clock) {
        if (activeRotationRef.current) {
          viewer.scene.camera.rotateRight(0.001);
        }
      });
      Cesium.GeoJsonDataSource.clampToGround = true;

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      handler.setInputAction(function (movement) {
        const feature = scene.pick(movement.endPosition);
        if (feature instanceof Cesium.Cesium3DTileFeature) {
          console.log("feature", feature);

          const propertyIds = feature.getPropertyIds();
          const length = propertyIds.length;
          for (let i = 0; i < length; ++i) {
            const propertyId = propertyIds[i];
            console.log(`{propertyId}: ${feature.getProperty(propertyId)}`);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      console.log("viewer", viewer);
    }
  }, [viewerRef]);

  useEffect(() => {
    if (tilesetRef.current) {
      console.log("tilesetRef.current", tilesetRef.current);
    }
  }, []);

  useEffect(() => {}, []);

  const heightOffset = 0;
  // Position tileset

  var surface = Cartesian3.fromRadians(7.20009, 51.272034, 0.0);
  var offset = Cartesian3.fromRadians(7.20009, 51.272034, heightOffset);
  var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
  const modelMatrix = Matrix4.fromTranslation(translation);

  let tilesetStyle = new Cesium.Cesium3DTileStyle({
    color: "rgba(256,256,256,1)",
    show: true,
    meta: {
      description: '"Building id ${id} has height ${Height}."',
    },
  });

  tilesetStyle = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [["true", "color('white',256)"]],
    },
  });

  return (
    <div className="App">
      <Viewer
        ref={viewerRef}
        timeline={false}
        animation={false}
        imageryProvider={false}
        baseLayerPicker={false}
        homeButton={false}
        geocoder={false}
        navigationHelpButton={false}
        // projectionPicker={false}
        sceneModePicker={false}
        fullscreenButton={false}
        full={true}
        infoBox={true}
        vrButton={true}
        onClick={(movement, target) => {
          console.log("xxx movement,target", { movement, target });
        }}
      >
        <Entity position={position}>
          <PointGraphics
            pixelSize={10}
            verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
          />
          {meshVisible && (
            <Cesium3DTileset
              ref={tilesetRef}
              modelMatrix={modelMatrix}
              // debugWireframe={true}
              // showOutline={true}
              // enableShowOutline={true}
              // debugShowRenderingStatistics={true}
              // enableDebugWireframe={true}
              // debugColorizeTiles={true}
              scene3DOnly={true}
              style={tilesetStyle}
              url={"https://wupp-3d-data.cismet.de/mesh/tileset.json"}
              onClick={(movement, target) => {
                console.log("movement,target", { movement, target });
              }}
            />
          )}
        </Entity>
        {/* </Camera> */}

        <div className="leaflet-control-container">
          <div className="leaflet-top leaflet-right">
            <div className="leaflet-bar leaflet-control">
              <a
                className="leaflet-bar-part"
                href="#"
                title="Vergrößern"
                role="button"
                aria-label="Vergrößern"
              >
                <FontAwesomeIcon icon={faBars} />
              </a>
            </div>
          </div>
        </div>

        <div
          id="conttrolboxUpperLeft"
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            _width: 100,
            _height: 100,
          }}
        >
          <div className="leaflet-control-container">
            <div className="leaflet-top leaflet-left">
              <div className="leaflet-control-zoom leaflet-bar leaflet-control">
                <a
                  className="leaflet-control-zoom-in"
                  href="#"
                  title="Vergrößern"
                  role="button"
                  aria-label="Vergrößern"
                  onClick={() => {
                    const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer
                    const scene = viewer.scene;
                    const camera = viewer.camera;
                    const ellipsoid = scene.globe.ellipsoid;

                    const cameraHeight = ellipsoid.cartesianToCartographic(
                      camera.position
                    ).height;
                    const moveRate = cameraHeight / 10.0;
                    camera.moveForward(moveRate);
                  }}
                >
                  +
                </a>
                <a
                  className="leaflet-control-zoom-out"
                  href="#"
                  title="Verkleinern"
                  role="button"
                  aria-label="Verkleinern"
                  onClick={() => {
                    const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer
                    const scene = viewer.scene;
                    const camera = viewer.camera;
                    const ellipsoid = scene.globe.ellipsoid;

                    const cameraHeight = ellipsoid.cartesianToCartographic(
                      camera.position
                    ).height;
                    const moveRate = cameraHeight / 10.0;
                    camera.moveBackward(moveRate);
                  }}
                >
                  −
                </a>
              </div>

              <div className="leaflet-bar leaflet-control">
                <a
                  className="leaflet-bar-part"
                  href="#"
                  onClick={() => {
                    const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer

                    // viewer.camera.flyTo({
                    //   duration: 0,
                    //   destination: Cartesian3.fromDegrees(7.20009, 51.272034, 1000),
                    //   orientation: {
                    //     heading: 0, // Cesium.Math.TWO_PI == East
                    //     pitch: -1 * Cesium.Math.PI_OVER_TWO,
                    //     roll: 0.0,
                    //   },
                    // });

                    const transform =
                      Cesium.Transforms.eastNorthUpToFixedFrame(home);
                    viewer.scene.camera.lookAtTransform(
                      transform,
                      new Cesium.HeadingPitchRange(0, -Math.PI / 4, 500)
                    );
                    unlockPosition(viewer);
                  }}
                  title="Vollbildmodus"
                >
                  <FontAwesomeIcon icon={faHouseUser}></FontAwesomeIcon>
                </a>
              </div>
              {/* <div className='leaflet-bar leaflet-control'>
                <a className='leaflet-bar-part' href='#' title='Vollbildmodus'>
                  <FontAwesomeIcon icon={faGlobe}></FontAwesomeIcon>
                </a>
              </div> */}
              <div className="leaflet-bar leaflet-control">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                <a
                  className="leaflet-bar-part"
                  href="#"
                  onClick={() => {
                    const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer

                    if (!activeRotation) {
                      lockPosition(viewer);
                      setActiveRotation(true);
                    } else {
                      setActiveRotation(false);
                      unlockPosition(viewer);
                    }
                  }}
                  title="Round and round and round and round"
                >
                  <FontAwesomeIcon
                    spin={activeRotation}
                    icon={faSync}
                  ></FontAwesomeIcon>
                </a>
              </div>
              {!meshVisible && (
                <div className="leaflet-bar leaflet-control">
                  <a
                    className="leaflet-bar-part"
                    href="#"
                    onClick={() => setMeshVisible(true)}
                    title="3D Mesh anzeigen"
                  >
                    <FontAwesomeIcon icon={faCube}></FontAwesomeIcon>
                  </a>
                </div>
              )}
              {meshVisible && (
                <div className="leaflet-bar leaflet-control">
                  <a
                    className="leaflet-bar-part"
                    href="#"
                    onClick={() => setMeshVisible(false)}
                    title="3D Mesh ausblenden"
                  >
                    <FontAwesomeIcon icon={faSquare}></FontAwesomeIcon>
                  </a>
                </div>
              )}
              <div className="leaflet-control-fullscreen leaflet-bar leaflet-control">
                <a
                  className="leaflet-control-fullscreen-button leaflet-bar-part"
                  href="#"
                  title="Vollbildmodus"
                  onClick={() => {
                    // const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer
                    // viewer.scene.camera.rotateRight(0.005);
                  }}
                ></a>
              </div>
              <div className="leaflet-bar leaflet-control">
                <a
                  className="leaflet-bar-part"
                  href="#"
                  title="Sperren/Entsprerren um den Mittelpunkt"
                  onClick={() => {
                    const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer

                    if (lockCenter === false) {
                      setLockCenter(true);

                      lockPosition(viewer);
                    } else {
                      unlockPosition(viewer);
                      setLockCenter(false);
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={lockCenter ? faLock : faLockOpen}
                  ></FontAwesomeIcon>
                </a>
              </div>
              <div className="leaflet-bar leaflet-control">
                <a
                  className="leaflet-bar-part"
                  href="#"
                  title="Info in JS Consoel schreiben"
                  onClick={async () => {
                    const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer
                    const {
                      cameraHeight,
                      lat,
                      lng,
                      center,
                      home,
                      windowPosition,
                      transform,
                      camera,
                    } = await getAll(viewer);
                    console.log("xxx info", {
                      cameraHeight,
                      lat,
                      lng,
                      center,
                      home,
                      windowPosition,
                      transform,
                      viewer,
                      camera,
                    });
                    console.log("xxx info pitch", camera.pitch);
                    console.log("xxx info heading", camera.heading);
                    console.log("xxx info camera.z", camera.position.z);
                    console.log("xxx info cameraHeight", cameraHeight);
                  }}
                >
                  <FontAwesomeIcon icon={faInfo}></FontAwesomeIcon>
                </a>
              </div>
              {dev && (
                <>
                  <div className="leaflet-bar leaflet-control">
                    <a
                      className="leaflet-bar-part"
                      href="#"
                      title="Experimentalfunktion 1"
                      onClick={() => {
                        const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer
                        var holeResourcePromise = Cesium.GeoJsonDataSource.load(
                          "/data/neubau.json",
                          {
                            clampToGround: true,
                          }
                        );

                        holeResourcePromise.then(function (dataSource) {
                          // Get the array of entities from the data source
                          var entities = dataSource.entities.values;
                          // Loop through the entities and find the one with a polygon geometry
                          for (var i = 0; i < entities.length; i++) {
                            var entity = entities[i];
                            if (entity.polygon) {
                              // This is a polygon entity, get the geometry
                              var polygonGeometry =
                                entity.polygon.hierarchy.getValue();
                              // Get the root tile of the tileset
                              console.log("xxx tilesetRef", tilesetRef);

                              var ts = tilesetRef.current.cesiumElement;
                              console.log("xxx tileset", ts);

                              // Add the hole to the root tile using the addHoles function
                              // root.addHoles([polygonGeometry]);
                            }
                          }
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faVial}></FontAwesomeIcon>
                    </a>
                  </div>
                  <div className="leaflet-bar leaflet-control">
                    <a
                      className="leaflet-bar-part"
                      href="#"
                      title="Experimentalfunktion 2"
                      onClick={() => {
                        const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer
                        unlockPosition(viewer);
                      }}
                    >
                      <FontAwesomeIcon icon={faVials}></FontAwesomeIcon>
                    </a>
                  </div>
                  <div className="leaflet-bar leaflet-control">
                    <a
                      className="leaflet-bar-part"
                      href="#"
                      title="Experimentalfunktion 3"
                      onClick={() => {
                        const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer

                        viewer.scene.camera.constrainedAxis =
                          Cesium.Cartesian3.UNIT_Z;
                      }}
                    >
                      <FontAwesomeIcon icon={faRocket}></FontAwesomeIcon>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* <Button
            onClick={() => {
              setMeshVisible(!meshVisible);
            }}
            style={{ position: "absolute", top: "0", left: "0" }}
          >
            {meshVisible ? "3D Ansicht verbergen" : "3D Ansicht (mesh) anzeigen"}
          </Button> */}
        </div>
      </Viewer>
      <div>
        <div
          style={{
            position: "absolute",
            top: (windowSize?.height || 500) / 2 - 1,
            width: windowSize?.width || "100%",
            height: "2px",
            backgroundColor: "#00000023",
            zIndex: "100000",
            pointerEvents: "none",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            left: (windowSize?.width || 500) / 2 - 1,
            height: windowSize?.height || "100%",
            width: "2px",
            backgroundColor: "#00000023",
            zIndex: "100000",
            pointerEvents: "none",
          }}
        ></div>
        <div
          style={{
            borderRadius: "50%",
            position: "absolute",
            left: (windowSize?.width || 500) / 2 - 10,
            top: (windowSize?.height || 500) / 2 - 10,
            height: "20px",
            width: "20px",
            backgroundColor: "#00000023",
            zIndex: "100000",
            pointerEvents: "none",
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;
