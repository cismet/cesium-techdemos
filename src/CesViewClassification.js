/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "./App.css";
import "leaflet-fullscreen-custom-container-fork";
import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";
// import IonResource from "cesium/Source/Core/IonResource";

import "leaflet/dist/leaflet.css";
import CesiumView from "./CesiumView";
import { Cesium3DTileset } from "resium";
import Cartesian3 from "cesium/Source/Core/Cartesian3";
import Matrix4 from "cesium/Source/Core/Matrix4";
import { useLayoutEffect, useRef, useState } from "react";
import Cross from "./components/Cross";
import ControlContainer from "./components/controls/ControlContainer";
import OnMapButton from "./components/controls/OnMapButton";
import { faBars, faCube, faSquare } from "@fortawesome/free-solid-svg-icons";
import Home from "./components/controls/Home";
import SpinningControl from "./components/controls/SpinningControl";
import FullScreenMode from "./components/controls/FullscreenMode";
import LockCenterControl from "./components/controls/LockCenterControl";
import DebugInfo from "./components/controls/DebugInfo";
import Experiments from "./components/controls/Experiments";
import * as Cesium from "cesium";
import ZoomControls from "./components/controls/ZoomControls";

const home = Cesium.Cartesian3.fromDegrees(7.20009, 51.272034, 150);

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
  const dev = process.env.NODE_ENV !== "production";

  const [meshVisible, setMeshVisible] = useState(true);
  const tilesetRef = useRef(null);
  const heightOffset = 0;
  var surface = Cartesian3.fromRadians(7.20009, 51.272034, 0.0);
  var offset = Cartesian3.fromRadians(7.20009, 51.272034, heightOffset);
  var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
  const modelMatrix = Matrix4.fromTranslation(translation);
  return (
    <div className="App">
      <CesiumView
        minZoom={300}
        postInit={(viewer) => {
          var promise = Cesium.GeoJsonDataSource.load("/data/neubauWH.json", {
            clampToGround: true,
          });
          promise.then(function (dataSource) {
            console.log("neubau", dataSource);
            // dataSource.clampToGround = true;
            viewer.dataSources.add(dataSource);

            var entities = dataSource.entities.values;
            for (var i = 0; i < entities.length; i++) {
              var entity = entities[i];
              console.log("entity", entity);

              //Extrude the polygon based on any attribute you desire
              entity.polygon.extrudedHeight = 160 + 25; //entity.properties.parent_id;
              entity.polygon.classificationType =
                Cesium.ClassificationType.CESIUM_3D_TILE;
              entity.polygon.outline = false;
              entity.polygoin.clampToGround = true;
              entity.polygon.material = Cesium.Color.fromRandom({
                alpha: 0.6,
              });
            }
          });
        }}
      >
        <ControlContainer position="topright">
          <OnMapButton icon={faBars} />
        </ControlContainer>

        <ControlContainer position="topleft">
          <ZoomControls />
          <Home home={home} />
          <SpinningControl />

          <LockCenterControl />
        </ControlContainer>

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
            onAllTilesLoad={() => {
              const tileset = tilesetRef.current.cesiumElement;
              console.log("onAllTilesLoad", tilesetRef.current);
              // // Wait for the tileset to be ready
              tileset.readyPromise.then(function () {
                // Wait for the data source to load
                console.log("xxx tileset ready");
              });
            }}
          />
        )}
      </CesiumView>
      <Cross windowSize={windowSize} />
    </div>
  );
}

export default App;
