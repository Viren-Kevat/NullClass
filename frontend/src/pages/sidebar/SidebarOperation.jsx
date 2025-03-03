import React from "react";
import "./SidebarOperation.css";

function SidebarOperation({ icon: Icon, text, active }) {
  return (
    <div
      className={`sidebar-operation ${active && "sidebar-operation--active"}`}
    >
      <Icon className="sidebarOperation__icon" />
      <h2>{text}</h2>
    </div>
  );
}

export default SidebarOperation;
