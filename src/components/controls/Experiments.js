import {
  faBars,
  faBox,
  faCube,
  faGlobe,
  faHouseUser,
  faInfo,
  faLock,
  faLockOpen,
  faRocket,
  faSquare,
  faSync,
  faVial,
  faVials,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Cesium from "cesium";
import { useCesium } from "resium";
import { unlockPosition } from "../../tools/position";
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
const Experiments = (props) => {
  const { viewer } = useCesium();
  const { tilesetRef } = props;
  return (
    <>
      <div className="leaflet-bar leaflet-control">
        <a
          className="leaflet-bar-part"
          href="#"
          title="Experimentalfunktion 1"
          onClick={() => {
            var holeResourcePromise = Cesium.GeoJsonDataSource.load(
              "/data/neubau.json",
              {
                clampToGround: true,
              }
            );

            holeResourcePromise.then(function (dataSource) {
              // Get the array of entities from the data source
              var entities = dataSource.entities.values;
              // Loop through the entities and find the one with a polygon geometry
              for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                if (entity.polygon) {
                  // This is a polygon entity, get the geometry
                  var polygonGeometry = entity.polygon.hierarchy.getValue();
                  // Get the root tile of the tileset
                  console.log("xxx tilesetRef", tilesetRef);

                  var ts = tilesetRef.current.cesiumElement;
                  console.log("xxx tileset", ts);

                  // Add the hole to the root tile using the addHoles function
                  // root.addHoles([polygonGeometry]);
                }
              }
            });
          }}
        >
          <FontAwesomeIcon icon={faVial}></FontAwesomeIcon>
        </a>
      </div>
      <div className="leaflet-bar leaflet-control">
        <a
          className="leaflet-bar-part"
          href="#"
          title="Experimentalfunktion 2"
          onClick={() => {
            unlockPosition(viewer);
          }}
        >
          <FontAwesomeIcon icon={faVials}></FontAwesomeIcon>
        </a>
      </div>
      <div className="leaflet-bar leaflet-control">
        <a
          className="leaflet-bar-part"
          href="#"
          title="Experimentalfunktion 3"
          onClick={() => {
            viewer.scene.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
          }}
        >
          <FontAwesomeIcon icon={faRocket}></FontAwesomeIcon>
        </a>
      </div>
    </>
  );
};

export default Experiments;
