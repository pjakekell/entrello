import React, { ReactNode } from "react";
import "react-day-picker/lib/style.css";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { classNames } from "../../utils/misc";
import { lang } from "../../locale";

import MomentLocaleUtils from "react-day-picker/moment";

interface IDateField {
  className?: string;
  formik: any; // couldn't find formik's return type
  name: string;
  label: string;
  number?: boolean;
  mask?: string | (string | RegExp)[];
  disabled?: boolean;
  onBlur?: any;
  icon?: ReactNode;
  helperText?: ReactNode;
  cornerHint?: ReactNode;
  placeholder?: string;
}

const DateField = ({
  className,
  number,
  formik,
  mask,
  name,
  label,
  helperText,
  cornerHint,
  icon,
  disabled,
  onBlur,
  placeholder,
}: IDateField) => {
  const handleDayChange = (
    day: Date,
    _DayModifiers: any,
    _dayPickerInput: DayPickerInput
  ) => {
    // const d = formik.values[name] || buildStartsAt();
    // d.setDay(day.getDay());
    // d.setMinutes(day.getDay());
    formik.setFieldValue(name, day);
  };

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
      <div className="mt-1 rounded-md shadow-sm border-gray-300 border py-2 relative flex items-center">
        <div className="mx-3">{icon}</div>
        <DayPickerInput
          onDayChange={handleDayChange}
          classNames={{
            overlayWrapper: "absolute left-0 mt-3 border rounded-md",
            overlay: "shadow rounded-md bg-white",
            container: "",
          }}
          // parseDate={(str: string) => new Date(str)}
          value={formik.values[name]}
          dayPickerProps={{
            locale: lang,
            localeUtils: MomentLocaleUtils,
          }}
          component={(props: any) => (
            <input
              {...props}
              className="block w-full pl-0 py-0 sm:text-sm border-none focus:ring-transparent outline-none"
            />
          )}
        />
      </div>
    </div>
  );
};

export default DateField;
