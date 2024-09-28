import React from "react";

interface IH1 {
  className?: string;
  children: any;
}

export function H1({ className, children }: IH1) {
  return (
    <div className={`my-2 p-2 font-bold text-indigo-400 text-lg ${className}`}>
      {children}
    </div>
  );
}
