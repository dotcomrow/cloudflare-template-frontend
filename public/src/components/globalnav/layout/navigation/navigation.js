import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Navigation = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const NAV_DATA = [
    {
      name: "Home",
      url: "/home",
      group: "*",
    },
  ];

  const [NAV_LIST, setNavList] = useState([]);

  useEffect(() => {
    var NAV_LIST = NAV_DATA.filter(
      (x) => !window.location.href.includes(x.url)
    );

    NAV_LIST = NAV_LIST.filter(
      (x) =>
        x.group === "*" ||
        (user &&
          user.user_settings &&
          user.user_settings.groups &&
          user.user_settings.groups.length > 0 &&
          user.user_settings.groups.find((y) => y.group_name === x.group) !=
            null)
    );

    setNavList(NAV_LIST);
  }, [user, location]);

  return (
    <nav className="nav-links-container">
      {NAV_LIST.map((navItem, index) => {
        return (
          <div key={navItem.name} className="me-4">
            <Link
              to={navItem.url}
              className="text-decoration-none navlink text-white"
            >
              {navItem.name}
            </Link>
          </div>
        );
      })}
    </nav>
  );
};

export default Navigation;
