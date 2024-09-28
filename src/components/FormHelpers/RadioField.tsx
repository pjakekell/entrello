import React from "react";
import { classNames } from "../../utils/misc";

interface IRadioField {
  className?: string;
  name: string;
  value?: boolean;
  onChange: Function;
  label: string;
  small?: boolean;
  disabled?: boolean;
}

const RadioField = ({
  className,
  name,
  value,
  onChange,
  label,
  small,
  disabled,
}: IRadioField) => {
  const handleChange = (e: any) => {
    onChange(name, e.target.checked);
  };

  return (
    <div
      className={classNames(
        className,
        "relative flex items-center",
        small ? "text-2xs" : "text-sm"
      )}
    >
      <div className="flex items-center h-5">
        <input
          type="radio"
          name={name}
          disabled={disabled}
          value={name}
          checked={value}
          onChange={handleChange}
          className={classNames(
            "focus:ring-brand-500 text-brand-600 border-gray-300 rounded cursor-pointer",
            small ? "h-3 w-3" : "h-4 w-4"
          )}
        />
      </div>
      <div className={classNames(small ? "ml-2" : "ml-3")}>
        <label
          htmlFor={name}
          className={classNames(`
            cursor-pointer 
            ${value
              ? "font-bold text-brand-600"
              : "font-medium text-gray-500"}`
          )}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default RadioField;
