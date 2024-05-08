import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useCesium } from "resium";
import { lockPosition, unlockPosition } from "../CesiumViewer/position";
import OnMapButton from "./OnMapButton";

const SpinningControl = (props) => {
  const { viewer } = useCesium();
  const [activeRotation, setActiveRotation] = useState(false);
  const activeRotationRef = useRef(null);

  useEffect(() => {
    activeRotationRef.current = activeRotation;
  }, [activeRotation]);
  useEffect(() => {
    viewer.clock.onTick.addEventListener(function (clock) {
      if (activeRotationRef.current) {
        viewer.scene.camera.rotateRight(0.001);
      }
    });
  }, [viewer]);
  return (
    <OnMapButton
      href="#"
      onClick={() => {
        if (!activeRotation) {
          lockPosition(viewer);
          setActiveRotation(true);
        } else {
          setActiveRotation(false);
          unlockPosition(viewer);
        }
      }}
      title="Round and round and round and round"
    >
      <FontAwesomeIcon spin={activeRotation} icon={faSync}></FontAwesomeIcon>
    </OnMapButton>
  );
};

export default SpinningControl;
