import { useCesium } from "resium";
import OnMapButton from "./OnMapButton";

const FullScreenMode = (props) => {
  const { viewer } = useCesium();
  return (
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
  );
};

export default FullScreenMode;
