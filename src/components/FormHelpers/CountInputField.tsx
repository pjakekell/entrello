import React from "react";
import { FormikProps } from "formik";
import classNames from "classnames";

import NumberFormat from "react-number-format";
import Btn from "../Btn/Btn";

interface ICountInputField {
  formik: FormikProps<any>;
  name: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function CountInputField({
  formik,
  name,
  min = 0,
  max = 999999,
  disabled = false
}: ICountInputField) {
  const onInputChange = (d: any) => {
    const value = parseInt(d.value);
    if(value < min) formik.setFieldValue(name, min.toString());
    else if(value > max) formik.setFieldValue(name, d.value.slice(0, d.value.length - 1));
    else formik.setFieldValue(name, d.value)
  }

  const onBtnClick = (isUp: boolean) => {
    if(disabled) return;

    const prevValue = parseInt(formik.values[name]);
    if(isUp) {
      if(prevValue < max) {
        formik.setFieldValue(name, prevValue + 1);
        formik.setFieldValue(`${name}-selected`, true);
      }
    }
    else {
      if(prevValue > min) {
        formik.setFieldValue(name, prevValue - 1);
        if(prevValue - 1 === 0)
          formik.setFieldValue(`${name}-selected`, false);
      }
    }
  }

  return (
    <div className="flex">
      <Btn
        className={classNames(
          "rounded-r-none w-12",
          disabled ? "bg-slate-200 border-slate-200" : ""
        )}
        color="primary"
        onClick={() => onBtnClick(false)}
      >
        -
      </Btn>
      <NumberFormat
        type="text"
        className="focus:ring-brand-500 focus:border-brand-500 block w-16 pl-2 sm:text-lg border-gray-300 text-center"
        thousandSeparator=" "
        decimalSeparator=","
        allowNegative={false}
        autoComplete="disabled"
        min={min}
        max={max}
        value={formik.values[name]}
        onValueChange={onInputChange}
        disabled={disabled}
      />
      <Btn
        className={classNames(
          "rounded-l-none w-12",
          disabled ? "bg-slate-200 border-slate-200" : ""
        )}
        color="primary"
        onClick={() => onBtnClick(true)}
      >
        +
      </Btn>
    </div>
  );
}