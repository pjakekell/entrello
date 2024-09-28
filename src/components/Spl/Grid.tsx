import React from "react";
import { useSelector } from "react-redux";
import { selectShowGrid } from "./logic";

interface IGridParams {
  hidden: boolean;
}

export default function Grid({ hidden }: IGridParams) {
  const showGrid = useSelector(selectShowGrid);

  return (
    <>
      <defs>
        <pattern
          id="grid"
          width="1000"
          height="1000"
          patternUnits="userSpaceOnUse"
        >
          <path
            d={
              !hidden && showGrid
                ? "M 400 500 L 600 500 500 500 500 400 500 600"
                : ""
            }
            className="small-grid"
          />
        </pattern>
      </defs>
      <rect
        width="100000%"
        height="100000%"
        x="-5000%"
        y="-5000%"
        fill="url(#grid)"
      />
    </>
  );
}
