import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ContextMenu, { Position } from "devextreme-react/context-menu";
import List from "devextreme-react/list";
import { useAuth } from "../../contexts/auth";
import { useAuth0 } from "@auth0/auth0-react";
import "./UserPanel.scss";

export default function UserPanel({ menuMode }) {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const { user, signOut } = useAuth();
  //console.log("user", user);
  const navigate = useNavigate();

  function navigateToProfile() {
    navigate("/profile");
  }
  const menuItems = useMemo(
    () => [
      {
        text: "Company Information",
        icon: "user",
        onClick: navigateToProfile,
      },
      {
        text: "Logout",
        icon: "runner",
        onClick: logout,
      },
    ],
    [logout]
  );
  return (
    <div className={"user-panel"}>
      <div className={"user-info"}>
        <div className={"image-container"}>
          <div
            style={{
              background: `url(${user.avatarUrl}) no-repeat #fff`,
              backgroundSize: "cover",
            }}
            className={"user-image"}
          />
        </div>
        <div className={"user-name"}>{user.name}</div>
      </div>

      {menuMode === "context" && (
        <ContextMenu
          items={menuItems}
          target={".user-button"}
          showEvent={"dxclick"}
          width={210}
          cssClass={"user-menu"}
        >
          <Position my={"top center"} at={"bottom center"} />
        </ContextMenu>
      )}
      {menuMode === "list" && (
        <List className={"dx-toolbar-menu-action"} items={menuItems} />
      )}
    </div>
  );
}
