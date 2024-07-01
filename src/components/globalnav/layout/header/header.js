import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "../navigation/navigation";
import Popover from "dtk/Popover";
import { useState } from "react";
import { logout, getDarkMode } from "../../../../common/store/slices/user/userSlice";
import { useSelector } from "react-redux";
import { Overline } from "dtk/Typography";

function MyImageComponent() {
  const [active, setActive] = useState(false);
  const user = useSelector((state) => state.user);
  const [darkMode, setDarkMode] = useState(false);

  function handleActive() {
    if (active) {
      setActive(false);
      document.querySelector(".overlay").style.display = "none";
      return;
    } else {
      setActive(true);
      document.querySelector(".overlay").style.display = "block";
      return;
    }
  }

  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", ({ matches }) => {
        setDarkMode(getDarkMode(user));
      });
  }, []);

  useEffect(() => {
    setDarkMode(getDarkMode(user));
  }, [user]);

  return (
    <div
      id="profile-img"
      className="profile-placeholder"
      onClick={() => handleActive()}
      style={{
        backgroundImage: "url(" + user.picture + ")",
      }}
    >
    <div className="overlay" onClick={() => handleActive()}></div>
      <Popover
        align="top"
        justify="start"
        active={active}
        usePortal={true}
        spacing={10}
        className="popover"
        darkMode={darkMode}
      >
        <div className="popoverWindow">
          <Overline darkMode={darkMode} className="popoverHeader">
            Welcome, {user.name}
          </Overline>
          <Link to="/profile" className="profileLink">
            Profile
          </Link>
          <Link
            onClick={() => {
              logout();
            }}
            className="profileLink"
          >
            Logout
          </Link>
        </div>
      </Popover>
    </div>
  );
}

const Header = () => {
  const [showFlyout, setShowFlyout] = useState(false);
  const flyoutRef = useRef(null);

  return window.location.href.indexOf("error") > -1 ? null : (
    <header className="navigation pt-0 navbar navbar-default">
      {/* <div
        className={`${
          showFlyout ? "position-relative" : ""
        } page-container navigation-container d-flex justify-content-between mobile-header-temporary`}
        style={{ zIndex: 800 }}
      >
        <div className="d-flex align-items-center ps-5">
          <div className="nav-menu flex-column">
            <div className="nav-menu-item">
              <button
                className="btn btn-link nav-link text-white text-decoration-none"
                onClick={() => setShowFlyout(!showFlyout)}
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
          <div className="d-flex align-items-end">
            <Link className="text-decoration-none text-white logo-image" to="/">
              <embed
                src="/armada.svg"
                alt="logo"
                style={{
                  height: "4rem",
                  width: "4rem",
                  "border-radius": "50%",
                  overflow: "hidden",
                }}
              />
            </Link>
            <h5 className="fw-bold text-nowrap live-text-box">
              <Link
                className="text-decoration-none ms-4 link-secondary live-text-link text-white"
                to="/home"
              >
                Armada
                <sup className="fw-bold me-2 live-text-superscript">TM</sup>
              </Link>
            </h5>
          </div>
        </div>
      </div> */}
      <div className="navigation-container d-flex justify-content-between">
        <div className="d-flex align-items-center ps-2">
          <div className="d-flex align-items-end">
            <h5 className="fw-bold text-nowrap live-text-box">
              {/* <Link
                className="text-decoration-none link-secondary live-text-link text-white"
                to="/home"
              >
                Armada
              </Link> */}
              {/* <Icon glyph="List" fill="#FF0000" /> */}
            </h5>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <Navigation />
        </div>
        <div className="d-flex align-items-right pe-2 pt-1 pb-1">
          <div className="d-flex align-items-center flex-column">
            <MyImageComponent />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
