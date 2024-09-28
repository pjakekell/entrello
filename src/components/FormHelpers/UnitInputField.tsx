import React, { useEffect, useRef } from "react";
import "./UnitInputField.css";

interface IUnitInputField {
  unit: string;
  min?: number;
  max?: number;
  value: any;
  onChange: any;
}

const UnitInputField = ({
  unit,
  min = 0,
  value,
  onChange
}: IUnitInputField) => {
  const inputRef: any = useRef();
  const resizeInputWidth = (value: string) => {
    if(!value.length) return;
    inputRef.current.style.width = `${value.length * 9}px`;
  }

  useEffect(() => {
    if(!inputRef.current) return;

    inputRef.current.addEventListener("input", resizeInputWidth, false);
    resizeInputWidth.call(inputRef.current, value);
  }, [value]);

  return (
    <div className="flex items-center">
      <input
        ref={inputRef}
        className="border-none text-md p-0 font-normal text-gray-400 focus:outline-none focus:ring-0 focus:shadow-none"
        style={{boxShadow: "none !important"}}
        type="number"
        id="units"
        name="units"
        min={min}
        value={value}
        onChange={onChange}
      />
      <span className="text-md font-normal text-gray-400">{unit}</span>
    </div>
  )
}

export default UnitInputField;