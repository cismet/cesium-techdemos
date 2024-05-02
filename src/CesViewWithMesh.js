/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "./App.css";
import "leaflet-fullscreen-custom-container-fork";
import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";

import "leaflet/dist/leaflet.css";
import CesiumView from "./CesiumView";
import { Cesium3DTileset } from "resium";
import { Cartesian3, Matrix4 } from "cesium";
import { useRef, useState } from "react";

function App() {
  const [meshVisible, setMeshVisible] = useState(true);
  const tilesetRef = useRef(null);
  const heightOffset = 0;
  var surface = Cartesian3.fromRadians(7.20009, 51.272034, 0.0);
  var offset = Cartesian3.fromRadians(7.20009, 51.272034, heightOffset);
  var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
  const modelMatrix = Matrix4.fromTranslation(translation);
  return (
    <div className="App">
      <CesiumView>
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
      </CesiumView>
    </div>
  );
}

export default App;
