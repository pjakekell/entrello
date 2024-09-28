import React, { useMemo } from "react";
import { classNames } from "../../utils/misc";
import { sprintf } from "sprintf-js";

import "./StepRange.css";

interface IStepRange {
  min: number;
  max: number;
  step: number;
  hiddenValues?: Array<string>;
  unit?: string;
  title?: string;
  label?: string;
  value: any;
  onChange: any;
}

const StepRange = ({
  min,
  max,
  step,
  hiddenValues = [],
  unit = "",
  title = "",
  label = "",
  value,
  onChange
}: IStepRange) => {
  const stepLabels: any = useMemo(() => {
    const labels = [];
    for(let interval = min; interval <= max; interval += step) {
      labels.push(interval.toString());
    }
    return labels;
  }, [min, max, step]);

  return (
    <>
      <h3 className="text-lg font-medium text-gray-400 leading-5">{title}</h3>
      <label className="text-sm font-normal text-gray-400">
        {unit === "%" ? sprintf(label, value * 100) : label}
      </label>
      <div className="relative px-4 py-4 bg-white border border-solid border-gray-200 rounded-sm">
        <input
          type="range"
          className="form-range appearance-none w-full h-1 p-0 bg-gray-200 slider-thumb focus:outline-none focus:ring-0 focus:shadow-none"
          min={min.toString()}
          max={max.toString()}
          step={step.toString()}
          value={unit === "%" ? value * 100 : value}
          onChange={(e: any) => 
            onChange(unit === "%" ? e.target.value / 100 : e.target.value, unit === "%" ? hiddenValues.map(value => (parseInt(value) / 100).toString()) : hiddenValues)}
          id="stepRange"
        />
        <ul className="flex justify-between w-full p-x-3">
          {
            stepLabels.map((label: string, index: number) => (
              <li 
                key={`label-${index}`}
                className={
                  classNames(
                    "flex justify-center absolute bottom-3.5 relative bg-white border border-solid border-gray-400 w-2.5 h-2.5 rounded-full",
                    hiddenValues.find(value => value === label) ? "bg-transparent border-none" : "cursor-pointer",
                    parseInt(unit=== "%" ? value * 100 : value) === parseInt(label) ? "bg-transparent border-none" : "cursor-pointer"
                  )}
              />
            ))
          }
        </ul>
        <ul className="flex justify-between px-5 left-0 w-full absolute bottom-6">
          {
            stepLabels.map((label: string, index: number) => (
              <li key={`mark-${index}`} className="flex justify-center relative">
                <span className={classNames(
                  "absolute text-sm font-normal text-gray-400",
                  hiddenValues.find(value => value === label) ? "hidden" : ""
                )}>{`${label}${unit}`}</span>
              </li>
            ))
          }
        </ul>
      </div>    
    </>
  )
}

export default StepRange;