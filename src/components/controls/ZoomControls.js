import { useCesium } from "resium";

const ZoomControl = (props) => {
  const { viewer } = useCesium();
  /* eslint-disable jsx-a11y/anchor-has-content */
  /* eslint-disable jsx-a11y/anchor-is-valid */
  return (
    <div className="leaflet-control-zoom leaflet-bar leaflet-control">
      <a
        className="leaflet-control-zoom-in"
        href="#"
        title="Vergrößern"
        role="button"
        aria-label="Vergrößern"
        onClick={() => {
          const scene = viewer.scene;
          const camera = viewer.camera;
          const ellipsoid = scene.globe.ellipsoid;

          const cameraHeight = ellipsoid.cartesianToCartographic(
            camera.position
          ).height;
          const moveRate = cameraHeight / 10.0;
          camera.moveForward(moveRate);
        }}
      >
        +
      </a>
      <a
        className="leaflet-control-zoom-out"
        href="#"
        title="Verkleinern"
        role="button"
        aria-label="Verkleinern"
        onClick={() => {
          const scene = viewer.scene;
          const camera = viewer.camera;
          const ellipsoid = scene.globe.ellipsoid;

          const cameraHeight = ellipsoid.cartesianToCartographic(
            camera.position
          ).height;
          const moveRate = cameraHeight / 10.0;
          camera.moveBackward(moveRate);
        }}
      >
        −
      </a>
    </div>
  );
};
export default ZoomControl;
