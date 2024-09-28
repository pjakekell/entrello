import React from "react";

interface ICtrlIcon {
  className: string;
}

export default function CtrlIcon({ className = "text-white" }: ICtrlIcon) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M19.78 11.78l-1.42 1.41L12 6.83l-6.36 6.36l-1.42-1.41L12 4l7.78 7.78z"
        fill="#626262"
      />
    </svg>
  );
}
