import React from "react";

interface ILoadingIcon {
  color?: string;
  className?: string;
  size?: number;
}

export default function LoadingIcon({
  className,
  color = "#ffffff",
  size = 44,
}: ILoadingIcon) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={color}
    >
      <g fill="none" fillRule="evenodd" strokeWidth={size > 50 ? 4 : 2}>
        <circle cx={size / 2} cy={size / 2} r="1">
          <animate
            attributeName="r"
            begin="0s"
            dur="1.8s"
            values={`1; ${size / 2}`}
            calcMode="spline"
            keyTimes="0; 1"
            keySplines="0.165, 0.84, 0.44, 1"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-opacity"
            begin="0s"
            dur="1.8s"
            values="1; 0"
            calcMode="spline"
            keyTimes="0; 1"
            keySplines="0.3, 0.61, 0.355, 1"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={size / 2} cy={size / 2} r="1">
          <animate
            attributeName="r"
            begin="-0.9s"
            dur="1.8s"
            values={`1; ${size / 2}`}
            calcMode="spline"
            keyTimes="0; 1"
            keySplines="0.165, 0.84, 0.44, 1"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-opacity"
            begin="-0.9s"
            dur="1.8s"
            values="1; 0"
            calcMode="spline"
            keyTimes="0; 1"
            keySplines="0.3, 0.61, 0.355, 1"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}
