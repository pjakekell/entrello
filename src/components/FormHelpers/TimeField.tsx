import React, {
  ReactNode,
  ChangeEvent,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { buildStartsAt } from "../Event/logic";
import InputMask from "react-input-mask";
import { classNames } from "../../utils/misc";

interface ITimeField {
  className?: string;
  value: Date | null;
  formik: any; // couldn't find formik's return type
  name: string;
  label: string;
  setTime: Dispatch<SetStateAction<string>>;
  number?: boolean;
  disabled?: boolean;
  onBlur?: any;
  ref?: any;
  icon?: ReactNode;
  helperText?: ReactNode;
  cornerHint?: ReactNode;
  placeholder?: string;
}

const TimeField = ({
  className,
  number,
  formik,
  name,
  label,
  value,
  helperText,
  cornerHint,
  icon,
  disabled,
  onBlur,
  ref,
  placeholder,
  setTime,
}: ITimeField) => {
  let getHour = (value || buildStartsAt()).getHours().toString();
  let getMinutes = (value || buildStartsAt()).getMinutes().toString();

  if (getHour === "0") {
    getHour = "00";
  }

  if (getMinutes === "0") {
    getMinutes = "00";
  }

  const completeTime = getHour + getMinutes;
  const [textValue, setTextValue] = useState(completeTime);
  const [valErr, setValErr] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);

    const timeParts = e.target.value.split(":");
    const hour = parseInt(timeParts[0]);
    const min = parseInt(timeParts[1]);
    if (isNaN(hour) || hour > 24 || isNaN(min) || min > 59) {
      setValErr(true);
      return;
    }
    setValErr(false);

    setTime(e.target.value);
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
          <span className="text-2xs text-gray-500">{cornerHint}</span>
        ) : null}
      </div>
      <div
        className={classNames(
          "mt-1 rounded-md shadow-sm border-gray-300 border py-2 relative flex items-center h-10",
          valErr ? " bg-red-100 border-red-400" : ""
        )}
      >
        <div className="mx-3">{icon}</div>
        <InputMask
          mask="99:99"
          maskPlaceholder=""
          placeholder={placeholder}
          name={name}
          id={name}
          disabled={disabled}
          type="text"
          autoComplete="disabled"
          onChange={handleChange}
          onFocus={(e) => e.target.select()}
          value={textValue}
          className={classNames(
            "block w-full pl-0 py-0 sm:text-sm border-none focus:ring-transparent outlin-none bg-transparent",
            disabled ? " text-gray-400" : "",
            valErr ? " text-red-700" : ""
          )}
        />
      </div>
    </div>
  );
};

export default TimeField;
