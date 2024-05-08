import React from "react";
import ReactDOM from "react-dom/client";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

import ViewMinimal from "./views/Minimal";
import ViewGeojson from "./views/Geojson";
import ViewFull from "./views/Full";
import ViewWithMesh from "./views/WithMesh";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ViewGeojson />}></Route>
          <Route path="/min" element={<ViewMinimal />}></Route>
          <Route path="/mesh" element={<ViewWithMesh />}></Route>
          <Route path="/full" element={<ViewFull />}></Route>
        </Routes>
      </div>
    </Router>
  </React.StrictMode>
);
