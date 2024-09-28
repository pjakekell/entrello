import React from "react";

interface IOptionIcon {
  className: string;
}

export default function OptionIcon({ className = "text-white" }: IOptionIcon) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M3 4h6.11l7.04 14H21v2h-6.12L7.84 6H3V4m11 0h7v2h-7V4z"
        fill="#626262"
      />
    </svg>
  );
}
