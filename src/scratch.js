var windowPosition = new Cesium.Cartesian2(
  viewer.container.clientWidth / 2,
  viewer.container.clientHeight / 2
);
var pickRay = viewer.scene.camera.getPickRay(windowPosition);
var pickPosition = viewer.scene.globe.pick(pickRay, viewer.scene);
var pickPositionCartographic =
  viewer.scene.globe.ellipsoid.cartesianToCartographic(pickPosition);
console.log(pickPositionCartographic.longitude * (180 / Math.PI));
console.log(pickPositionCartographic.latitude * (180 / Math.PI));

if (!activeRotation) {
  const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer
  const camera = viewer.camera;

  var ellipsoid = viewer.scene.mapProjection.ellipsoid;

  const height = viewer._lastHeight;

  const width = viewer._lastWidth;

  var windowCoordinates = new Cesium.Cartesian2(height / 2, width / 2);

  var ray = viewer.camera.getPickRay(windowCoordinates);

  var intersection = Cesium.IntersectionTests.rayEllipsoid(ray, ellipsoid);

  var intersectionPoint = Cesium.Ray.getPoint(ray, intersection.start);
  const cameraHeight = ellipsoid.cartesianToCartographic(
    camera.position
  ).height;
  const timer = setInterval(function () {
    viewer.camera.rotate(intersectionPoint, 0.001);
  }, 1);
  setRotationTimer(timer);
  setActiveRotation(true);
} else {
  clearInterval(rotationTimer);
  setRotationTimer(undefined);

  setActiveRotation(false);
}
// Grant CesiumJS access to your ion assets
// Cesium.Ion.defaultAccessToken = "_your_cesium_ion_acess_token_";

var viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: Cesium.createWorldTerrain(),
});

// Lock camera to a point
var center = Cesium.Cartesian3.fromRadians(
  2.4213211833389243,
  0.6171926869414084,
  3626.0426275055174
);
var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
viewer.scene.camera.lookAtTransform(
  transform,
  new Cesium.HeadingPitchRange(0, -Math.PI / 8, 2900)
);

// Orbit this point
viewer.clock.onTick.addEventListener(function (clock) {
  viewer.scene.camera.rotateRight(0.005);
});
///------

import logo from "./logo.svg";
import "./App.css";
import {
  Color,
  Cartesian3,
  CesiumTerrainProvider,
  createWorldTerrain,
  Ion,
} from "cesium";
import {
  Viewer,
  Entity,
  PointGraphics,
  Cesium3DTileset,
  CameraFlyTo,
  Camera,
} from "resium";
import { useEffect, useRef, useState } from "react";
import Matrix4 from "cesium/Source/Core/Matrix4";
import * as Cesium from "cesium";
import styled, { css } from "styled-components";
// import IonResource from "cesium/Source/Core/IonResource";
// Ion.defaultAccessToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYzc4ZmZlNy1jNDU4LTQzZTYtOGJmZC01M2QxNzUwMTQxOTQiLCJpZCI6MTEwODcxLCJpYXQiOjE2NjU1NTk1NjF9.Yaxb7A6gyHGhBwDQcCVmEf7g10QNoyD1NIC2TWI4hBs";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen-custom-container-fork";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseUser,
  faGlobe,
  faSync,
  faCube,
  faBox,
  faSquare,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

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

function App() {
  const position = Cartesian3.fromDegrees(7.20009, 51.2718, 155);
  const viewerRef = useRef(null);
  const tilesetRef = useRef(null);
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
        layers: "R102:trueortho202010",
        format: "image/png",
        enablePickFeatures: false,
      });

      const verdis = new Cesium.WebMapServiceImageryProvider({
        url: "https://maps.wuppertal.de/deegree/wms",
        layers: "R102:trueortho202010",
      });

      viewer.scene.globe.baseColor = Cesium.Color.BLACK;

      viewer.imageryLayers.addImageryProvider(provider);
      viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;

      viewer.camera.flyTo({
        duration: 0,
        destination: Cartesian3.fromDegrees(7.20009, 51.272034, 1000),
        orientation: {
          heading: 0, // Cesium.Math.TWO_PI == East
          pitch: -1 * Cesium.Math.PI_OVER_TWO,
          roll: 0.0,
        },
      });
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

  // tilesetStyle = new Cesium.Cesium3DTileStyle({
  //   color: {
  //     conditions: [
  //       ["${height}===undefined", "color('red')"],
  //       ["${height}!==undefined", "color('green')"],
  //     ],
  //   },
  // });

  const [meshVisible, setMeshVisible] = useState(true);
  const [activeRotation, setActiveRotation] = useState(false);
  const [rotationTimer, setRotationTimer] = useState();

  const [camPatameters, setCamPatameters] = useState({});
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
        onClick={(movement, target) => {
          console.log("xxx movement,target", { movement, target });
        }}
      >
        {/* <Camera
          position={Cartesian3.fromDegrees(7.20009, 51.272034, 0)}
          direction={Cartesian3.fromDegrees(7.20009, 51.272034, 5000)}
        /> */}

        {/* <CameraFlyTo
          duration={0}
          destination={Cartesian3.fromDegrees(7.20009, 51.272034, 1000)}
          orientation={{
            heading: 0, // Cesium.Math.TWO_PI == East
            pitch: -1 * Cesium.Math.PI_OVER_TWO,
            roll: 0.0,
          }}
        /> */}

        <Entity position={position}>
          <PointGraphics
            pixelSize={10}
            verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
          />
          {meshVisible && (
            <Cesium3DTileset
              modelMatrix={modelMatrix}
              // debugWireframe={true}
              // showOutline={true}
              // enableShowOutline={true}
              // debugShowRenderingStatistics={true}
              // enableDebugWireframe={true}
              // debugColorizeTiles={true}
              scene3DOnly={true}
              style={tilesetStyle}
              url={"https://3dmodels.cismet.de/ex/tileset_1.json"}
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

                    viewer.camera.flyTo({
                      duration: 0,
                      destination: Cartesian3.fromDegrees(
                        7.20009,
                        51.272034,
                        1000
                      ),
                      orientation: {
                        heading: 0, // Cesium.Math.TWO_PI == East
                        pitch: -1 * Cesium.Math.PI_OVER_TWO,
                        roll: 0.0,
                      },
                    });
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
                    if (!activeRotation) {
                      const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer
                      const camera = viewer.camera;

                      var ellipsoid = viewer.scene.mapProjection.ellipsoid;

                      var windowCoordinates = new Cesium.Cartesian2(
                        viewer.container.clientWidth / 2,
                        viewer.container.clientHeight / 2
                      );

                      var ray = viewer.camera.getPickRay(windowCoordinates);

                      var intersection = Cesium.IntersectionTests.rayEllipsoid(
                        ray,
                        ellipsoid
                      );

                      var intersectionPoint = Cesium.Ray.getPoint(
                        ray,
                        intersection.start
                      );
                      const cameraHeight = ellipsoid.cartesianToCartographic(
                        camera.position
                      ).height;
                      const timer = setInterval(function () {
                        viewer.camera.rotate(intersectionPoint, 0.001);
                      }, 1);
                      setRotationTimer(timer);
                      setActiveRotation(true);
                    } else {
                      clearInterval(rotationTimer);
                      setRotationTimer(undefined);

                      setActiveRotation(false);
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
                ></a>
              </div>
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
    </div>
  );
}

export default App;
//-------

// Grant CesiumJS access to your ion assets
// Cesium.Ion.defaultAccessToken = "_your_cesium_ion_acess_token_";

var viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: Cesium.createWorldTerrain(),
});

// Lock camera to a point
var wupp = Cesium.Cartesian3.fromDegrees(7.20009, 51.272034, 150);

var center = Cesium.Cartesian3.fromRadians(
  2.4213211833389243,
  0.6171926869414084,
  3626.0426275055174
);
var transform = Cesium.Transforms.eastNorthUpToFixedFrame(wupp);
viewer.scene.camera.lookAtTransform(
  transform,
  new Cesium.HeadingPitchRange(0, -Math.PI / 4, 500)
);

// Orbit this point
viewer.clock.onTick.addEventListener(function (clock) {
  viewer.scene.camera.rotateRight(0.005);
});
