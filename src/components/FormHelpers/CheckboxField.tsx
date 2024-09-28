import { isFunction, isUndefined } from "lodash";
import React, { ReactNode } from "react";
import { classNames } from "../../utils/misc";

interface ICheckboxField {
  className?: string;
  formik: any; // couldn't find formik's return type
  name: string;
  tabIndex?: number;
  value?: boolean;
  onChange?: any;
  label: string;
  small?: boolean;
  light?: boolean;
  disabled?: boolean;
  description?: ReactNode;
}

const CheckboxField = ({
  className,
  formik,
  tabIndex,
  name,
  value,
  onChange,
  label,
  small,
  light,
  description,
  disabled,
}: ICheckboxField) => {
  const handleChange = (e: any) => {
    if (isFunction(onChange)) {
      onChange(e.target.checked);
      return;
    }

    formik.setFieldValue(name, e.target.checked);
  };

  const val = isUndefined(value) ? formik.values[name] : value;

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
          type="checkbox"
          name={name}
          id={name}
          tabIndex={tabIndex}
          disabled={disabled}
          onChange={handleChange}
          checked={val}
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
            ${formik.values[name]
              ? `${light ? "font-medium" : "font-bold"} text-brand-600`
              : `${light ? "font-normal" : "font-medium"} text-gray-500`}`
          )}
        >
          {label}
        </label>
        {description ? (
          <p id="comments-description" className="text-gray-400">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default CheckboxField;
