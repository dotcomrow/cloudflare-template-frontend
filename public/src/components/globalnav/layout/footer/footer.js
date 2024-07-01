import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {

  return ((window.location.href.indexOf("error") > -1) ? null :
    <footer className="footer bg-black">
      <div className="flex pt-2 ps-2 pb-3 pe-2 text-center">
        <div className="d-inline inverse-container">
          <Link to="/home" className="text-decoration-none text-white">
            Home
          </Link>
        </div>
        <span className="d-none d-md-inline ms-3 text-white footer-text">
          |
        </span>
        <span className="ms-3 text-white footer-text fw-normal">
            &copy; {new Date().getFullYear()}{" "} Suncoast Systems
        </span>
      </div>
    </footer>
  );
};

export default Footer;