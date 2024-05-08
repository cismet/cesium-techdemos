import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useCesium } from "resium";
import { lockPosition, unlockPosition } from "../CesiumViewer/position";
import OnMapButton from "./OnMapButton";

const LockCenterControl = (props) => {
  const { viewer } = useCesium();
  const [lockCenter, setLockCenter] = useState(false);

  return (
    <OnMapButton
      title="Sperren/Entsprerren um den Mittelpunkt"
      onClick={() => {
        if (lockCenter === false) {
          setLockCenter(true);

          lockPosition(viewer);
        } else {
          unlockPosition(viewer);
          setLockCenter(false);
        }
      }}
    >
      <FontAwesomeIcon
        icon={lockCenter ? faLock : faLockOpen}
      ></FontAwesomeIcon>
    </OnMapButton>
  );
};

export default LockCenterControl;
