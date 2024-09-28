import React from "react";

export default function Container({ children }: any) {
  return (
    <div className="px-2 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto h-full">
      {children}
    </div>
  );
}
