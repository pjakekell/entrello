import React from "react";
import LoadingIcon from "./LoadingIcon";
import { classNames } from "../../utils/misc";
import Btn from "./Btn";

interface LoadingBtnParams {
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  className?: string;
  color?: "primary" | "secondary" | "warning" | "danger" | "none" | "success";
  sm?: boolean;
  loading: boolean;
  darkLoader?: boolean;
  children: any;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const LoadingBtn = ({
  type = "button",
  disabled = false,
  sm = false,
  className = "",
  darkLoader = false,
  loading = false,
  color = "primary",
  onClick,
  children,
}: LoadingBtnParams) => (
  <Btn
    type={type}
    sm={sm}
    disabled={disabled}
    className={classNames("flex items-center", className)}
    onClick={onClick}
    color={color}
  >
    {loading ? (
      <LoadingIcon
        size={16}
        className={`mr-2${darkLoader ? " text-gray-500" : null}`}
      />
    ) : null}
    {children}
  </Btn>
);

export default LoadingBtn;
