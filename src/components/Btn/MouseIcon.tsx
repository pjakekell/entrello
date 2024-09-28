import React from "react";

interface IMouseIcon {
  className: string;
}

export default function MouseIcon({ className = "text-white" }: IMouseIcon) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 256 256"
    >
      <path d="M128 32h-20a56 56 0 0 0-56 56v24h76z" opacity=".4" fill="#444" />
      <path
        d="M148 24h-40a64.072 64.072 0 0 0-64 64v80a64.072 64.072 0 0 0 64 64h40a64.072 64.072 0 0 0 64-64V88a64.072 64.072 0 0 0-64-64zm48 64v16h-60V40h12a48.055 48.055 0 0 1 48 48zm-88-48h12v64H60V88a48.055 48.055 0 0 1 48-48zm40 176h-40a48.055 48.055 0 0 1-48-48v-48h136v48a48.055 48.055 0 0 1-48 48z"
        fill="#626262"
      />
    </svg>
  );
}
