import React from "react";
import Tippy from "@tippyjs/react/headless";

export enum Placement {
  top = "top",
  bottom = "bottom",
  left = "left",
  right = "right",
}

interface ITooltip {
  children: any;
  placement?: Placement | undefined;
  content: any;
}

const Tooltip = ({
  children,
  content,
  placement = Placement.bottom,
}: ITooltip) => (
  <Tippy
    placement={placement}
    render={(attrs) => (
      <div
        className="rounded shadow-lg py-1 px-4 bg-gray-700 text-white text-xs"
        tabIndex={-1}
        role="tooltip"
        {...attrs}
      >
        {content}
        <div data-popper-arrow />
      </div>
    )}
  >
    {children}
  </Tippy>
);

export default Tooltip;
