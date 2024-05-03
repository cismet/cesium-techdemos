import "./App.css";
import "leaflet-fullscreen-custom-container-fork";
import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";
import "leaflet/dist/leaflet.css";
import CesiumView from "./CesiumView";
import ColorHash from "color-hash";
import {
  Cesium3DTileset,
  GeoJsonDataSource,
  ScreenSpaceEventHandler,
  ScreenSpaceEvent,
} from "resium";
import { Cartesian3, Matrix4, Color, ScreenSpaceEventType } from "cesium";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Cross from "./components/Cross";
import ControlContainer from "./components/controls/ControlContainer";
import OnMapButton from "./components/controls/OnMapButton";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Home from "./components/controls/Home";
import SpinningControl from "./components/controls/SpinningControl";
import LockCenterControl from "./components/controls/LockCenterControl";
import ZoomControls from "./components/controls/ZoomControls";
//import buffer from "@turf/buffer";

/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
// const home = Cartesian3.fromDegrees(7.20009, 51.272034, 150);
const sample_buildings_src = "dataSamples/buildings.json";
const DEFAULT_TRANSPARENCY = 0.7;
const colorHash = new ColorHash();
const materialLookup = {};

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
  const [transparency, setTransparency] = useState(DEFAULT_TRANSPARENCY);

  const viewerRef = useRef(null);
  //const tilesetRef = useRef(null);
  const [footprints, setFootprints] = useState(null);
  const [propertyKeys, setPropertyKeys] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState("GEB_FKT");

  const heightOffset = 0;
  var surface = Cartesian3.fromRadians(7.20009, 51.272034, 0.0);
  var offset = Cartesian3.fromRadians(7.20009, 51.272034, heightOffset);
  var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
  const modelMatrix = Matrix4.fromTranslation(translation);

  // Buffer the GeoJSON geometry
  // const bufferedGeoJson = buffer(sample_buildings_src, 100, { units: "meters" });

  function handleClick(event) {
    console.log("pickedFeature", viewerRef);
    const scene = viewerRef.current.cesiumElement.scene;
    const pickedFeature = scene.pick(event.position);
    if (pickedFeature) {
      pickedFeature.color = Color.RED.withAlpha(0.5);
    }
  }

  useEffect(() => {
    // list unique property keys available in the GeoJsonDataSource
    // and print them to the console in a list
    if (footprints) {
      const keys = new Set();
      footprints.entities.values.forEach((entity) => {
        entity.properties.propertyNames.forEach((key) => keys.add(key));
      });
      setPropertyKeys(keys);
    }
  }, [footprints]);

  useEffect(() => {
    footprints &&
      footprints.entities.values.forEach((entity) => {
        // Get the property you want to base the color on
        const property = entity.properties[selectedProperty].toString();
        // Determine the color based on the property
        let color = colorHash.rgb(property);

        // If the material doesn't exist yet, create it
        if (!materialLookup[property]) {
          const [r, g, b] = color;
          materialLookup[property] = new Color(
            r / 255,
            g / 255,
            b / 255,
            1 // Initial alpha value
          );
        }
        // Update the material with the new transparency
        entity.polygon.material = Color.fromAlpha(
          materialLookup[property],
          transparency
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transparency, selectedProperty, footprints]);

  return (
    <div className="App">
      <CesiumView>
        <ControlContainer position="topright">
          <OnMapButton icon={faBars} />
        </ControlContainer>

        <ControlContainer position="topleft">
          <ZoomControls />
          <Home home={null} />
          <SpinningControl />

          <LockCenterControl />
        </ControlContainer>
        <ControlContainer position="bottomleft">
          <div className="leaflet-bar leaflet-control leaflet-control-layers-expanded">
            {propertyKeys && (
              <select
                value={selectedProperty}
                onChange={(event) => setSelectedProperty(event.target.value)}
              >
                {Array.from(propertyKeys).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            )}
            <hr />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={transparency}
              onChange={(event) =>
                setTransparency(parseFloat(event.target.value))
              }
            />
          </div>
        </ControlContainer>
        <ScreenSpaceEventHandler>
          <ScreenSpaceEvent
            action={handleClick}
            type={ScreenSpaceEventType.LEFT_CLICK}
          />
        </ScreenSpaceEventHandler>
        <Cesium3DTileset
          modelMatrix={modelMatrix}
          url={"https://wupp-3d-data.cismet.de/mesh/tileset.json"}
        />
        <GeoJsonDataSource
          data={sample_buildings_src}
          clampToGround={true}
          onLoad={(dataSource) => {
            dataSource && setFootprints(dataSource);
          }}
        />
      </CesiumView>
      <Cross windowSize={windowSize} />
    </div>
  );
}

export default App;
