import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ICmdKeyParams {
  label?: string | React.ReactNode;
  label2?: string | React.ReactNode;
  icon?: IconProp;
  desc: string;
}

export default function CmdKey({ icon, label, label2, desc }: ICmdKeyParams) {
  return (
    <div className="flex items-center mb-1">
      <div className="shadow border border-gray-300 bg-gray-200 text-gray-500 rounded w-5 h-5 mr-2 text-3xs flex items-center justify-center font-bold">
        {icon ? <FontAwesomeIcon icon={icon} /> : null}
        {icon ? null : label}
      </div>
      {label && label2 ? <span className="pr-2">+</span> : null}
      {label2 ? (
        <div>
          <div className="shadow border border-gray-300 bg-gray-200 text-gray-500 rounded w-5 h-5 mr-2 text-3xs flex items-center justify-center font-bold">
            {label2}
          </div>
        </div>
      ) : null}
      <div className="text-xs">{desc}</div>
    </div>
  );
}
