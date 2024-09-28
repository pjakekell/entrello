import { useState, useRef } from "react";
import { MenuPlacement } from "react-select";

interface IUseMenuPlacement {
  selectRef: any;
  menuPlacement: MenuPlacement;
};

export function useMenuPlacement({ selectRef, menuPlacement }: IUseMenuPlacement) {
  const [innerMenuPlacement, setInnerMenuPlacement] = useState<MenuPlacement>("auto");
  const menuObserver = useRef<{observe: any, disconnect: any} | null>(null);

  const onMenuOpen = () => {
    const observeOnscreen: IntersectionObserverCallback = (entries = []) => {
      const { boundingClientRect, intersectionRect } = entries[0];
      const isOffscreen = intersectionRect["height"] < boundingClientRect["height"];

      if (menuPlacement === "auto" && isOffscreen) {
        setInnerMenuPlacement("top");
      }
    };

    setTimeout(() => {
      const menuList = selectRef.current?.select?.menuListRef;
      menuObserver.current = new IntersectionObserver(observeOnscreen);
      if(menuList) {
        console.log(menuObserver.current);
        console.log("menuList", menuList)
        menuObserver.current.observe(menuList);
      }
    }, 1);
  };

  const onMenuClose = () => {
    menuObserver.current && menuObserver.current.disconnect();
  };

  const placement = innerMenuPlacement || menuPlacement;

  return {
    onMenuOpen,
    onMenuClose,
    placement,
  };
};