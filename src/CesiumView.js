import * as Cesium from "cesium";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Viewer } from "resium";
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "./App.css";
import "leaflet-fullscreen-custom-container-fork";
import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";
// import IonResource from "cesium/Source/Core/IonResource";

import "leaflet/dist/leaflet.css";
import { unlockPosition } from "./tools/position";
import Cross from "./components/Cross";
import { initializeCesium } from "./tools/init";

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
function CesiumView(props) {
  const windowSize = useWindowSize();

  const home =
    props.home || Cesium.Cartesian3.fromDegrees(7.20009, 51.272034, 150);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (viewerRef?.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement; // is Cesium's Viewer
      initializeCesium(viewer, home, props.postInit);
      unlockPosition(viewer);
    }
  }, [viewerRef]);

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
        //sceneMode={Cesium.SceneMode.COLUMBUS_VIEW}
        onClick={(movement, target) => {
          console.log("xxx movement,target", { movement, target });
        }}
      >
        {props.children}
      </Viewer>
      {props.crosshair && <Cross windowSize={windowSize} />}
    </div>
  );
}

export default CesiumView;
