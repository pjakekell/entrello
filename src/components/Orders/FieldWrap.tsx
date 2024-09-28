import React from "react";
import classNames from "classnames";

interface IFieldWrap {
  children: React.ReactNode;
  label: string | React.ReactNode;
  vertical?: boolean;
  className?: string | undefined;
}

const FieldWrap = ({
  children,
  label,
  className,
  vertical = false,
}: IFieldWrap) => (
  <div
    className={classNames(
      vertical
        ? ""
        : "flex my-2 justify-stretch items-center text-sm leading-none",
      className ? className : "items-center"
    )}
  >
    <div
      className={classNames(
        "text-sm text-gray-500",
        vertical ? "" : "ml-6 w-24 text-gray-400 uppercase flex-none"
      )}
    >
      {label}
    </div>
    {children}
  </div>
);

export default FieldWrap;
