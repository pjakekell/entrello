import React from "react";
import { classNames } from "../../utils/misc";

interface IBtn {
  type?: "button" | "submit" | "reset" | undefined;
  color?:
    | "primary"
    | "default"
    | "secondary"
    | "warning"
    | "info"
    | "purple-info"
    | "danger"
    | "none"
    | "success";
  sm?: boolean;
  outline?: boolean;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Btn({
  type = "button",
  color = "primary",
  disabled = false,
  className = "",
  outline = false,
  sm = false,
  children,
  onClick,
}: IBtn) {
  let colors = {
    primary: "bg-brand-500 border-brand-500 text-white",
    default: "bg-gray-300 border-gray-300 text-gray-600",
    info: "bg-blue-300 border-blue-300 text-white",
    "purple-info": "bg-purple-300 border-purple-300 text-white",
    success: "bg-green-600 border-green-600 text-white",
    secondary: "bg-gray-300 border-gray-300 text-gray-600",
    warning: "bg-yellow-400 border-yellow-400 text-yellow-800",
    danger: "bg-red-400 border-red-400 text-white",
    disabled: "bg-gray-200 text-gray-500",
    none: "",
  };
  if (outline) {
    colors = {
      primary: "border-brand-500 text-brand-500",
      default: "border-gray-300 text-gray-600",
      success: "border-green-600 text-green-600",
      secondary: "border-gray-300 text-gray-600",
      info: "border-blue-300 text-blue-400",
      "purple-info": "border-purple-300 text-purple-600",
      warning: "border-yellow-400 text-yellow-600",
      danger: "border-red-400 text-red-600",
      disabled: "border-gray-300 text-gray-500",
      none: "",
    };
  }

  const handleClick = (e: any) => {
    if (typeof onClick !== "function") return;
    onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      type={type}
      className={classNames(
        `rounded-full border-2`,
        sm ? "px-2 text-xs leading-4 py-1" : "text-sm px-3 py-1",
        !disabled ? colors[color] : "",
        disabled ? colors.disabled : null,
        disabled && color !== "default" ? "opacity-40" : null,
        disabled ? "cursor-default" : "cursor-pointer",
        className
        )}
    >
      {children}
    </button>
  );
}
