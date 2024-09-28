import React from "react";
import ReactDatePicker from "react-datepicker";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IIconDatePicker {
  className?: string;
  onChange: (date: Date) => void;
  selected: Date;
  icon?: any;
};

export default function IconDatePicker({
  className = "",
  onChange,
  selected,
  icon
}: IIconDatePicker) {
  return (
    <div className="relative">
      <ReactDatePicker
        className={
          classNames(
            "input w-24 h-8 pl-6 rounded-md border border-solid border-slate-300 text-xs focus:border-brand-500 outline-none",
            className
          )}
        onChange={onChange}
        selected={selected}
      />
      {
        icon
        ? <FontAwesomeIcon icon={icon} className="absolute w-3 h-3 left-1 top-2.5" />
        : null
      }
    </div>
  );
}