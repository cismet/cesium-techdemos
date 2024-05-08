import "leaflet-fullscreen-custom-container-fork";
import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";

import "leaflet/dist/leaflet.css";
import CesiumViewer from "../components/CesiumViewer";

function App() {
  return (
    <div className="App">
      <CesiumViewer />
    </div>
  );
}

export default App;
