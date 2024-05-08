import { useCesium } from "resium";
import OnMapButton from "./OnMapButton";
import * as Cesium from "cesium";
import { getAll, unlockPosition } from "../CesiumViewer/position";
import { faHouseUser, faInfo } from "@fortawesome/free-solid-svg-icons";
const DebugInfo = (props) => {
  const { viewer } = useCesium();
  return (
    <OnMapButton
      icon={faInfo}
      {...props}
      onClick={async () => {
        const {
          cameraHeight,
          lat,
          lng,
          center,
          home,
          windowPosition,
          transform,
          camera,
        } = await getAll(viewer);
        console.log("xxx info", {
          cameraHeight,
          lat,
          lng,
          center,
          home,
          windowPosition,
          transform,
          viewer,
          camera,
        });
        console.log("xxx info pitch", camera.pitch);
        console.log("xxx info heading", camera.heading);
        console.log("xxx info camera.z", camera.position.z);
        console.log("xxx info cameraHeight", cameraHeight);
      }}
    >
      {props.children}
    </OnMapButton>
  );
};

export default DebugInfo;
