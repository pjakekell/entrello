import React, { ReactNode } from "react";
import { Breadcrumbs, IBreadcrums } from "../Breadcrumbs";

type SettingsLayoutProps = {
  children: ReactNode;
  config: IBreadcrums;
  title: string;
  background?: boolean;
  button?: boolean;
  buttonFunction?: () => void;
  buttonText?: string;
  md?: boolean;
};

export function SettingsLayout({
  children,
  config,
  title,
  background = true,
  button = false,
  buttonFunction,
  buttonText,
  md = true,
}: SettingsLayoutProps) {
  return (
    <>
      <Breadcrumbs links={config.links} />
      <div
        className={`${
          md ? "md:w-1/2" : "md:w-full"
        } space-y-6 mx-auto pb-16 pt-8`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg text-gray-600">{title}</h3>
          {button ? (
            <button
              type="button"
              onClick={buttonFunction}
              className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              {buttonText}
            </button>
          ) : null}
        </div>
        {background ? <div className="">{children}</div> : children}
      </div>
    </>
  );
}
