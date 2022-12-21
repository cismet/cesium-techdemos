/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "./App.css";
import "leaflet-fullscreen-custom-container-fork";
import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";
// import IonResource from "cesium/Source/Core/IonResource";

import "leaflet/dist/leaflet.css";
import CesiumView from "./CesiumView";

function App() {
  return (
    <div className="App">
      <CesiumView />
    </div>
  );
}

export default App;
