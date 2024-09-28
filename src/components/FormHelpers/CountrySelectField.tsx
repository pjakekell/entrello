import React, { ReactNode } from "react";
import { classNames } from "../../utils/misc";
import countries from "i18n-iso-countries";
import { lang } from "../../locale";

interface ICountrySelectField {
  className?: string;
  formik: any; // couldn't find formik's return type
  name: string;
  label: string;
  disabled?: boolean;
  onBlur?: any;
  helperText?: ReactNode;
  cornerHint?: ReactNode;
}

const CountrySelectField = ({
  className,
  formik,
  name,
  label,
  helperText,
  cornerHint,
  disabled,
  onBlur,
}: ICountrySelectField) => {
  const countryList = [
    { code: "AT", name: countries.getName("AT", lang) },
    { code: "DE", name: countries.getName("DE", lang) },
    { code: "CH", name: countries.getName("CH", lang) },
    { code: "GB", name: countries.getName("GB", lang) },
    { code: "SI", name: countries.getName("SI", lang) },
    { code: "HR", name: countries.getName("HR", lang) },
    { code: "HU", name: countries.getName("HU", lang) },
    { code: "CZ", name: countries.getName("CZ", lang) },
    { code: "SK", name: countries.getName("SK", lang) },
    { code: "PL", name: countries.getName("PL", lang) },
    { code: "MK", name: countries.getName("MK", lang) }
  ];
  return (
    <div className={classNames(className)}>
      <div className="flex justify-between items-end">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        {cornerHint ? (
          <span className="text-2xs text-gray-500" id="email-optional">
            {cornerHint}
          </span>
        ) : null}
      </div>
      <select
        id={name}
        name={name}
        autoComplete={name}
        onChange={formik.handleChange}
        onBlur={onBlur}
        value={formik.values.country}
        disabled={disabled}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="" disabled selected>Select a country</option>
        {countryList.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
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

export default CountrySelectField;
