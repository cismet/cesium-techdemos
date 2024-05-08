import "leaflet-fullscreen-custom-container-fork";
import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";

import "leaflet/dist/leaflet.css";
import { Cesium3DTileset } from "resium";
import Cartesian3 from "cesium/Source/Core/Cartesian3";
import Matrix4 from "cesium/Source/Core/Matrix4";
import { useRef, useState } from "react";
import CesiumViewer from "../components/CesiumViewer";

function App() {
  const [meshVisible] = useState(true);
  const tilesetRef = useRef(null);
  const heightOffset = 0;
  var surface = Cartesian3.fromRadians(7.20009, 51.272034, 0.0);
  var offset = Cartesian3.fromRadians(7.20009, 51.272034, heightOffset);
  var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
  const modelMatrix = Matrix4.fromTranslation(translation);
  return (
    <div className="App">
      <CesiumViewer>
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
      </CesiumViewer>
    </div>
  );
}

export default App;
