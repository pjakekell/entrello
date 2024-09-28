import React from "react";
import TopMenu from "./TopMenu";
import Toaster from "../Toaster/Toaster";

interface IProps {
  children: React.ReactNode;
}

export default function Layout({ children }: IProps) {
  return (
    <div className="bg-paper-100 min-h-screen h-full flex flex-col items-stretch justify-stretch">
      <TopMenu />
      <div>{children}</div>
      <Toaster />
    </div>
  );
}
