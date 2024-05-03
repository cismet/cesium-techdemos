import React from "react";
import ReactDOM from "react-dom/client";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

import Minimal from "./CesViewMinimal";
import CesClassifyTilesetByGeojson from "./CesClassifyTilesetByGeojson";

import CesViewClassification from "./CesViewClassification";
import CesViewClassification2 from "./CesViewClassification2";
import CesViewFull from "./CesViewFull";
import CesViewWithMesh from "./CesViewWithMesh";
import reportWebVitals from "./reportWebVitals";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CesClassifyTilesetByGeojson />}></Route>
          <Route path="/min" element={<Minimal />}></Route>
          <Route path="/mesh" element={<CesViewWithMesh />}></Route>
          <Route path="/full" element={<CesViewFull />}></Route>
          <Route
            path="/classification"
            element={<CesViewClassification />}
          ></Route>
          <Route
            path="/classification2"
            element={<CesViewClassification2 />}
          ></Route>
          <Route path="/full" element={<CesViewFull />}></Route>
          {/* <Route path="/turnableTopicMap" element={< />}></Route>
          <Route path="/turnableTopicMap2" element={<LibreMap2 />}></Route>
          <Route path="/turnableTopicMap3" element={<LibreMap3 />}></Route>

          <Route path="/topicmapWithNewLocator" element={<App />}></Route>

          <Route path="/sensorDemo" element={<SensorMap />}></Route>
          <Route path="/qrklima" element={<Klima />}></Route> */}
        </Routes>
      </div>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
