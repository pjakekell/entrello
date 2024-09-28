import React from "react";
import SvgLogo from "../../logo-text.svg";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-l from-brand-100 to-brand-700">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white text-gray-600 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
            <div className="flex justify-center">
              <img className="h-12 w-auto" src={SvgLogo} alt="Workflow" />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
