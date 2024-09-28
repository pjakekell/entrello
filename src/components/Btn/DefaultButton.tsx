import React, { ReactNode } from "react";

type DefaultButtonProps = {
  children?: ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
};

export function DefaultButton({ children, type }: DefaultButtonProps) {
  return (
    <button
      type={type}
      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
    >
      {children}
    </button>
  );
}
