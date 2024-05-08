import * as Cesium from "cesium";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Viewer } from "resium";

import "leaflet-fullscreen-custom-container-fork";
import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";

import "leaflet/dist/leaflet.css";
import { unlockPosition } from "./position";
import Cross from "../Cross";
import { initializeCesium } from "./init";

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
function CesiumViewer(props) {
  const windowSize = useWindowSize();

  const home =
    props.home || Cesium.Cartesian3.fromDegrees(7.20009, 51.272034, 150);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (viewerRef?.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer
      initializeCesium(viewer, props, home, props.postInit);
      unlockPosition(viewer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerRef]);

  return (
    <div className="App">
      ()
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
        infoBox={false}
        vrButton={false}
        //sceneMode={Cesium.SceneMode.COLUMBUS_VIEW}
      >
        {props.children}
      </Viewer>
      {props.crosshair && <Cross windowSize={windowSize} />}
    </div>
  );
}

export default CesiumViewer;
