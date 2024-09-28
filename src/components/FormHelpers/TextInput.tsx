import React, { ReactNode } from "react";
import { Field, FormikProps } from "formik";

interface ITextInput {
  htmlFor: string;
  label: ReactNode;
  type: string;
  disabled?: boolean;
  name: string;
  id?: string;
  autocomplete?: string;
  props: FormikProps<any>;
  children?: ReactNode;
}

export function TextInput({
  htmlFor,
  label,
  type,
  name,
  disabled = false,
  props,
  children,
}: ITextInput) {
  return (
    <>
      <div className="flex">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor={htmlFor}
        >
          {label}
        </label>
        {children}
      </div>
      <Field
        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md ${
          disabled ? "text-gray-400" : "text-gray-600"
        }`}
        type={type}
        disabled={disabled}
        name={name}
      />
      {props.touched[name] && props.errors[name] ? (
        <p className="mt-2 text-sm text-red-600" id="name-error">
          {props.errors[name]}
        </p>
      ) : null}
    </>
  );
}
