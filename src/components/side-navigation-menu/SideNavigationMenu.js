import React, { useEffect, useRef, useCallback, useMemo } from "react";
import TreeView from "devextreme-react/tree-view";
import { navigation } from "../../app-navigation";
import { useNavigation } from "../../contexts/navigation";
import { useScreenSize } from "../../utils/media-query";
import "./SideNavigationMenu.scss";
import { useAuth } from "../../contexts/auth";

import * as events from "devextreme/events";

export default function SideNavigationMenu(props) {
  const { user } = useAuth();
  const { children, selectedItemChanged, openMenu, compactMode, onMenuReady } =
    props;

  const { isLarge } = useScreenSize();
  function normalizePath() {
    //console.log("user ", user);
    return navigation
      .filter(
        (item) =>
          (user.administrator === "Y" && item.auth === "Y") ||
          (user.administrator === "N" && item.auth === "N") ||
          (user.administrator === "Y" &&
            item.auth === "X" &&
            user.thisClientcode !== "")
      )
      .map((item) => ({
        ...item,
        expanded: determineIfNodeShouldBeExpanded(item),
        path: item.path && !/^\//.test(item.path) ? `/${item.path}` : item.path,
      }));
  }

  function determineIfNodeShouldBeExpanded(item) {
    // Example criterion: expand if item has a certain property value
    // You can replace this with your own logic
    return item.expanded === "Y";
  }

  // .map((item) => ({
  //   ...item,
  //   expanded: isLarge,
  //   path: item.path && !/^\//.test(item.path) ? `/${item.path}` : item.path,
  // }));

  const items = useMemo(
    normalizePath,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const {
    navigationData: { currentPath },
  } = useNavigation();

  const treeViewRef = useRef(null);
  const wrapperRef = useRef();
  const getWrapperRef = useCallback(
    (element) => {
      const prevElement = wrapperRef.current;
      if (prevElement) {
        events.off(prevElement, "dxclick");
      }

      wrapperRef.current = element;
      events.on(element, "dxclick", (e) => {
        openMenu(e);
      });
    },
    [openMenu]
  );

  useEffect(() => {
    const treeView = treeViewRef.current && treeViewRef.current.instance;
    if (!treeView) {
      return;
    }

    if (currentPath !== undefined) {
      treeView.selectItem(currentPath);
      treeView.expandItem(currentPath);
    }

    if (compactMode) {
      treeView.collapseAll();
    }
  }, [currentPath, compactMode]);

  return (
    <div
      className={"dx-swatch-additional side-navigation-menu"}
      ref={getWrapperRef}
    >
      {children}
      <div className={"menu-container"}>
        <TreeView
          ref={treeViewRef}
          items={items}
          keyExpr={"path"}
          selectionMode={"single"}
          focusStateEnabled={false}
          expandEvent={"click"}
          onItemClick={selectedItemChanged}
          onContentReady={onMenuReady}
          width={"100%"}
        />
      </div>
    </div>
  );
}
