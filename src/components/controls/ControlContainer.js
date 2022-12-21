const getPosClass = (pos) => {
  switch (pos) {
    case "topleft":
      return "leaflet-top leaflet-left";
    case "topright":
      return "leaflet-top leaflet-right";
    case "bottomleft":
      return "leaflet-bottom leaflet-left";
    case "bottomright":
      return "leaflet-bottom leaflet-right";
    default:
      return "leaflet-control";
  }
};

const ControlContainer = (props) => {
  const { position, children } = props;
  let positionClassname = getPosClass(position);
  return (
    <div className="leaflet-control-container">
      <div className={positionClassname}>{children}</div>
    </div>
  );
};
export default ControlContainer;
