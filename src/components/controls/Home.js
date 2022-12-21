import { useCesium } from "resium";
import OnMapButton from "./OnMapButton";
import * as Cesium from "cesium";
import { unlockPosition } from "../../tools/position";
import { faHouseUser } from "@fortawesome/free-solid-svg-icons";
const Home = (props) => {
  const { home } = props;
  const { viewer } = useCesium();
  return (
    <OnMapButton
      icon={faHouseUser}
      {...props}
      onClick={(e) => {
        const transform = Cesium.Transforms.eastNorthUpToFixedFrame(home);
        viewer.scene.camera.lookAtTransform(
          transform,
          new Cesium.HeadingPitchRange(0, -Math.PI / 4, 500)
        );
        unlockPosition(viewer);
      }}
    >
      {props.children}
    </OnMapButton>
  );
};

export default Home;
