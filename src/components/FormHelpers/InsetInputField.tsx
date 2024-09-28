import React, { ReactNode, useState } from "react";
import { classNames } from "../../utils/misc";
import NumberFormat from "react-number-format";

interface IInsetInputField {
  className?: string;
  formik: any; // couldn't find formik's return type
  name: string;
  label: string;
  disabled?: boolean;
  helperText?: ReactNode;
  cornerHint?: ReactNode;
  icon?: ReactNode;
  placeholder?: string;
  number?: boolean;
  percent?: boolean;
  currency?: string;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const setInitialValue = (val: string, currency: boolean, percent: boolean) => {
  if (currency) return parseFloat(val) / 100.0;
  if (percent) return parseFloat(val) * 100.0;
  return val;
};

const InsetInputField = ({
  className,
  formik,
  name,
  label,
  helperText,
  cornerHint,
  disabled,
  percent,
  icon,
  currency,
  number,
  placeholder,
  onInputChange
}: IInsetInputField) => {
  const initialVal = setInitialValue(
    formik.values ? formik.values[name] : "",
    !!currency,
    percent || false
  );
  const [val, setVal] = useState((initialVal || "").toString());

  const onChange = (d: any) => {
    setVal(d.floatValue);
    let value = d.floatValue || 0;
    if (currency) value = Math.round(value * 100.0);
    if (percent) value = value.toFixed(2) / 100.0;
    formik.setFieldValue(name, value);
  };

  return (
    <div className={classNames(className)}>
      <div className="flex justify-between items-end">
        <label
          htmlFor="name"
          className="block text-sm font-normal text-gray-700"
        >
          {label}
        </label>
        {cornerHint ? (
          <span className="text-2xs text-gray-500" id="email-optional">
            {cornerHint}
          </span>
        ) : null}
      </div>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        {number ? (
          <NumberFormat
            value={parseFloat(val && val.length === 0 ? "0" : val)}
            thousandSeparator=" "
            decimalSeparator=","
            decimalScale={currency ? 2 : 1}
            fixedDecimalScale={!!currency}
            suffix={percent ? " %" : ""}
            prefix={currency ? `${currency} ` : ""}
            placeholder={placeholder}
            name={name}
            id={name}
            disabled={disabled}
            type="text"
            autoComplete="disabled"
            onValueChange={onChange}
            className={classNames(
              "focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md",
              disabled ? " text-gray-400" : ""
            )}
          />
        ) : (
          <input
            type="text"
            name={name}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            onChange={onInputChange ? onInputChange : formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[name]}
            className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
          />
        )}
      </div>
      <div>
        {formik.touched[name] && formik.errors[name] ? (
          <p className="mt-2 text-sm text-red-600" id="name-error">
            {formik.errors[name]}
          </p>
        ) : null}
        {formik.touched[name] && formik.errors[name] ? null : (
          <div className="text-xs">{helperText}</div>
        )}
      </div>
    </div>
  );
};

export default InsetInputField;
