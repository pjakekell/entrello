import React, { ReactNode } from "react";
import { classNames } from "../../utils/misc";
import InputMask from "react-input-mask";

interface IInputField {
  className?: string;
  formik: any; // couldn't find formik's return type
  name: string;
  label: string;
  autoFocus?: boolean;
  number?: boolean;
  mask?: string | (string | RegExp)[];
  disabled?: boolean;
  onBlur?: any;
  refField?: any;
  helperText?: ReactNode;
  cornerHint?: ReactNode;
  placeholder?: string;
  nestedProperty?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  className,
  number,
  formik,
  mask,
  name,
  label,
  helperText,
  cornerHint,
  autoFocus,
  disabled,
  onBlur,
  refField,
  placeholder,
  nestedProperty,
  onChange
}: IInputField) => {
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
      {number ? (
        <InputMask
          mask={mask ? mask : "99999"}
          maskPlaceholder=""
          placeholder={placeholder}
          autoFocus={autoFocus}
          name={name}
          id={name}
          ref={refField}
          disabled={disabled}
          type="text"
          autoComplete="disabled"
          onChange={onChange ? onChange : formik.handleChange}
          onBlur={formik.handleBlur}
          value={nestedProperty ? (formik.values[nestedProperty][name.replace(`${nestedProperty}.`, '')] ? formik.values[nestedProperty][name.replace(`${nestedProperty}.`, '')].toString() : "") : (formik.values[name] ? formik.values[name].toString() : "")}
          className={classNames(
            "focus:ring-brand-500 focus:border-brand-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
            disabled ? " text-gray-400" : "", label ? 'mt-1' : ''
          )}
        />
      ) : (
        <input
          type="text"
          name={name}
          autoFocus={autoFocus}
          id={name}
          ref={refField}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange ? onChange : formik.handleChange}
          onBlur={onBlur || undefined}
          value={formik.values[name]}
          className="mt-1 focus:ring-brand-500 focus:border-brand-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      )}
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

export default InputField;
