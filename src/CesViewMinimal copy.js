import {
  faBars,
  faCube,
  faLock,
  faLockOpen,
  faSquare,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cartesian3, CesiumTerrainProvider, Color, Ion } from "cesium";
import * as Cesium from "cesium";
import { Matrix4 } from "cesium";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Cesium3DTileset, Entity, PointGraphics, Viewer } from "resium";
import ZoomControls from "./components/controls/ZoomControls";
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "./App.css";
import "leaflet-fullscreen-custom-container-fork";
import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";

import "leaflet/dist/leaflet.css";
import ControlContainer from "./components/controls/ControlContainer";
import OnMapButton from "./components/controls/OnMapButton";
import Home from "./components/controls/Home";
import { lockPosition, unlockPosition } from "./tools/position";
import FullScreenMode from "./components/controls/FullscreenMode";
import DebugInfo from "./components/controls/DebugInfo";
import Experiments from "./components/controls/Experiments";
import Cross from "./components/Cross";
import { initializeCesium } from "./tools/init";
import SpinningControl from "./components/controls/SpinningControl";
import LockCenterControl from "./components/controls/LockCenterControl";

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
function App() {
  const windowSize = useWindowSize();

  const home = Cesium.Cartesian3.fromDegrees(7.20009, 51.272034, 150);
  const position = Cartesian3.fromDegrees(7.20009, 51.2718, 155);
  const viewerRef = useRef(null);
  const tilesetRef = useRef(null);

  const [meshVisible, setMeshVisible] = useState(true);

  const dev = process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (viewerRef?.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer
      initializeCesium(viewer, undefined, home);
      unlockPosition(viewer);

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      handler.setInputAction(function (movement) {
        const feature = viewer.scene.pick(movement.endPosition);
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
        </Entity>

        {meshVisible && (
          <Cesium3DTileset
            ref={tilesetRef}
            modelMatrix={modelMatrix}
            // debugWireframe={true}
            // showOutline={true}
            // enableShowOutline={true}
            // debugShowRenderingStatistics={true}
            // enableDebugWireframe={true}
            //debugColorizeTiles={true}
            scene3DOnly={true}
            url={"https://wupp-3d-data.cismet.de/mesh/tileset.json"}
            onClick={(movement, target) => {
              console.log("movement,target", { movement, target });
            }}
          />
        )}

        <ControlContainer position="topright">
          <OnMapButton icon={faBars} />
        </ControlContainer>

        <ControlContainer position="topleft">
          <ZoomControls />
          <Home home={home} />
          <SpinningControl />

          {!meshVisible && (
            <OnMapButton
              onClick={() => setMeshVisible(true)}
              title="3D Mesh anzeigen"
              icon={faCube}
            ></OnMapButton>
          )}
          {meshVisible && (
            <OnMapButton
              onClick={() => setMeshVisible(false)}
              title="3D Mesh ausblenden"
              icon={faSquare}
            ></OnMapButton>
          )}
          <FullScreenMode />
          <LockCenterControl />

          {dev && (
            <>
              <DebugInfo />
              <Experiments tilesetRef={tilesetRef} />
            </>
          )}
        </ControlContainer>
      </Viewer>
      <Cross windowSize={windowSize} />
    </div>
  );
}

export default App;
