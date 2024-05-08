import "leaflet-fullscreen-custom-container-fork";
import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";
import "leaflet/dist/leaflet.css";
import CesiumViewer from "../components/CesiumViewer";
import ColorHash from "color-hash";
import { Cesium3DTileset, GeoJsonDataSource } from "resium";
import {
  Cartesian3,
  Matrix4,
  Color,
  ShadowMode,
  ClassificationType,
} from "cesium";
import { useEffect, useLayoutEffect, useState } from "react";
import Cross from "../components/Cross";
import ControlContainer from "../components/controls/ControlContainer";
import OnMapButton from "../components/controls/OnMapButton";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Home from "../components/controls/Home";
import SpinningControl from "../components/controls/SpinningControl";
import LockCenterControl from "../components/controls/LockCenterControl";
import ZoomControls from "../components/controls/ZoomControls";
//import buffer from "@turf/buffer";

/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
const home = Cartesian3.fromDegrees(7.20009, 51.272034, 150);
const sample_buildings_src = "dataSamples/buildings.json";
const sample_buildings_src_buffered = "dataSamples/buildings_buffered_1m.json";
const sample_buildings_src_voronoi = "dataSamples/buildings_voronoi_buffered_2m.json";

const DEFAULT_FOOTPRINT_ALPHA = 0.7;
const DEFAULT_TILESET_ALPHA = 0.7;
const HIGHLIGHT_COLOR = Color.YELLOW;
const HIGHLIGHT_COLOR_ALPHA = 0.7;

const colorHash = new ColorHash({
  saturation: [0.8],
  lightness: [0.25, 0.75],
});
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
  const [footprintAlpha, setFootprintAlpha] = useState(DEFAULT_FOOTPRINT_ALPHA);
  const [tilesetAlpha, setTilesetAlpha] = useState(DEFAULT_TILESET_ALPHA);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [clipPolygons, setClipPolygons] = useState(null);
  const [footprintSrc, setFootprintSrc] = useState(sample_buildings_src);
  const [isLoadingFootprints, setIsLoadingFootprints] = useState(true);

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

  const getMaterial = (entity, alpha) => {
    const str = entity.properties[selectedProperty].toString();
    const colorHexKey = colorHash.hex(str).substring(1); // remove # from the beginning

    // If the material doesn't exist yet, create it
    if (!materialLookup[colorHexKey]) {
      const [r, g, b] = colorHash.rgb(str);
      materialLookup[colorHexKey] = new Color(
        r / 255,
        g / 255,
        b / 255,
        1 // Initial alpha value
      );
    }

    // Return the material with the new transparency
    return Color.fromAlpha(materialLookup[colorHexKey], alpha);
  };

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
    setIsLoadingFootprints(true); // Set loading to true when footprintSrc changes
  }, [footprintSrc]);

  useEffect(() => {
    if (!isLoadingFootprints && footprints) {
      footprints.entities.values.forEach((entity) => {
        entity.polygon.material = getMaterial(entity, footprintAlpha);
        entity.polygon.classificationType = ClassificationType.BOTH;
        entity.polygon.shadows = ShadowMode.ENABLED;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [footprintAlpha, selectedProperty, footprints, isLoadingFootprints]);



  useEffect(() => {
    footprints &&
      footprints.entities.values.forEach((entity) => {
        // Get the property you want to base the color on
        // Determine the color based on the property
        // Update the material with the new transparency
        if (entity.id === selectedEntity.id) {
          entity.polygon.material = HIGHLIGHT_COLOR.withAlpha(
            HIGHLIGHT_COLOR_ALPHA
          );
          entity.polygon.outline = true;
          entity.polygon.outlineColor = Color.RED;
          entity.polygon.outlineWidth = 20.0;
        } else {
          entity.polygon.material = getMaterial(entity, footprintAlpha);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEntity]);

  return (
    <div className="App">
      <CesiumViewer disableZoomRestrictions={true} minZoom={300}>
        <ControlContainer position="topright">
          <OnMapButton icon={faBars} />
        </ControlContainer>

        <ControlContainer position="topleft">
          <ZoomControls />
          <Home home={home} />
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
              value={footprintAlpha}
              onChange={(event) =>
                setFootprintAlpha(parseFloat(event.target.value))
              }
            />
            <div>
              {" "}
              <hr />
              <input
                type="radio"
                id="unbuffered"
                name="sourceFile"
                value={sample_buildings_src}
                checked={footprintSrc === sample_buildings_src}
                onChange={(e) => setFootprintSrc(e.target.value)}
              />
              <label htmlFor="unbuffered">0m</label>
              <input
                type="radio"
                id="buffered"
                name="sourceFile"
                value={sample_buildings_src_buffered}
                checked={footprintSrc === sample_buildings_src_buffered}
                onChange={(e) => setFootprintSrc(e.target.value)}
              />
              <label htmlFor="buffered">1m</label>
              <input
                type="radio"
                id="vbuffered"
                name="sourceFile"
                value={sample_buildings_src_voronoi}
                checked={footprintSrc === sample_buildings_src_voronoi}
                onChange={(e) => setFootprintSrc(e.target.value)}
              />
              <label htmlFor="vbuffered">2m Voronoi</label>
            </div>
          </div>
        </ControlContainer>
        <Cesium3DTileset
          modelMatrix={modelMatrix}
          url={"https://wupp-3d-data.cismet.de/mesh/tileset.json"}
          clippingPolygons={clipPolygons}
        />
        <GeoJsonDataSource
          data={footprintSrc}
          clampToGround={true}
          elevation={100}
          onLoad={(dataSource) => {
            dataSource && setFootprints(dataSource);
            setIsLoadingFootprints(false);
          }}
          onClick={(movementEvent, target) => {
            console.log("pickedFeature", target.id);
            if (target.id) {
              setSelectedEntity(target.id);
            } else {
              setSelectedEntity(null);
            }
          }}
        />
      </CesiumViewer>
      <Cross windowSize={windowSize} />
    </div>
  );
}

export default App;
