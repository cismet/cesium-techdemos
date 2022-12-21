import { useCesium } from "resium";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */

const OnMapButton = (props) => {
  const { icon, children, title, href = "#", role, ariaLabel, onClick } = props;
  const { viewer } = useCesium();
  return (
    <div className="leaflet-bar leaflet-control">
      <a
        className="leaflet-bar-part"
        href={href}
        title={title}
        role={role}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {icon && <FontAwesomeIcon icon={icon} />}
        {children}
      </a>
    </div>
  );
};

export default OnMapButton;
