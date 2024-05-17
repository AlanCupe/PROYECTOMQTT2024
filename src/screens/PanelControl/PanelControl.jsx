import React, { memo, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./PanelControl.css";

export const PanelControl = memo(() => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="container-panelControl">
      <nav className="nav-control">
        <ul>
          <li>
            <NavLink
              to={"/panelcontrol/registrousers"}
              className={({ isActive }) => (isActive ? "active" : "inactive")}
            >
              Registrar Personal
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/panelcontrol/registroibecons"}
              className={({ isActive }) => (isActive ? "active" : "inactive")}
            >
              Registrar Beacon
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/panelcontrol/beaconasignation"}
              className={({ isActive }) => (isActive ? "active gold-border" : "inactive gold-border")}
            >
              Asignación de Beacon
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/panelcontrol/arearegister"}
              className={({ isActive }) => (isActive ? "active" : "inactive")}
            >
              Registrar Area | Gateway
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/panelcontrol/areaasignation"}
              className={({ isActive }) => (isActive ? "active gold-border" : "inactive gold-border")}
            >
              Asignación de Area de Trabajo
            </NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
});
