import React from "react";

interface IProps {
  label?: String;
}

export default function FullpageLoader({ label }: IProps) {
  return (
    <div className="loader-wrap fullpage-loader-wrap">
      <div className="loader"></div>
      {label && <div className="loader-label">{label}</div>}
    </div>
  );
}

