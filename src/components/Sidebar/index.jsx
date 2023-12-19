import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../context/userContext";
import SideBarItem from "./sidebar-item";

import "./styles.css";
// import logo from '../../assets/images/white-logo.png';
import LogoutIcon from "../../assets/icons/logout.svg";

function SideBar({ menu }) {
  const location = useLocation();
  const [active, setActive] = useState(1);
  const { logOut } = useAuth();

  useEffect(() => {
    menu.forEach((element) => {
      const data = location.pathname.split("/:");
      if (location.pathname === element.path) {
        setActive(element.id);

      }
      if (data.length === 2) {

        if (data[0] === element.path) {
          setActive(element.id);

        }
      }
    });
  }, [location.pathname]);

  const __navigate = (id) => {
    setActive(id);
  };

  const logout = async () => await logOut();

  return (
    <nav className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-logo-container">
          {/* <img src={logo} alt="logo" style={{ width: "100%" }} /> */}
          <h2 style={{ color: "white" }} >Manhole</h2>
        </div>

        <div className="sidebar-container">
          <div className="sidebar-items">
            {menu.map((item, index) => (
              <div key={index} onClick={() => __navigate(item.id)}>
                <SideBarItem active={item.id === active} item={item} />
              </div>
            ))}
          </div>

          <div className="sidebar-footer" onClick={logout}>
            <img
              src={LogoutIcon}
              alt="icon-logout"
              className="sidebar-item-icon"
            />
            <span className="sidebar-item-label">Logout</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SideBar;
