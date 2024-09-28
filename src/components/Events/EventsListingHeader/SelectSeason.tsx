import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { classNames } from "../../../utils/misc";
import { FormikProps } from "formik";

type SelectSeasonPros = {
  className?: string;
  options: {
    id: number;
    name: string;
  }[];
  disabled?: boolean;
  props: FormikProps<any>;
  value: {
    id: number;
    name: string;
  };
  name: string;
};

export default function SelectSeason({
  className = "",
  name,
  options,
  value,
  props,
  disabled = false,
}: SelectSeasonPros) {
  return (
    <Listbox
      value={value}
      onChange={(value) => {
        props.setFieldValue(name, value);
      }}
      disabled={disabled}
    >
      {({ open }) => (
        <>
          <div className={
            classNames(
              "relative w-50",
              className
            )}>
            <Listbox.Button
              className={`${
                disabled
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white cursor-default"
              } relative w-full border border-gray-300 rounded-full shadow-sm pl-3 pr-10 py-1.5 text-left focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm`}
            >
              <div className="truncate flex items-center">
                {value.name}
              </div>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                {options.map((person) => (
                  <Listbox.Option
                    key={person.id}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-brand-600" : "text-gray-900",
                        "cursor-default select-none relative py-2 pl-3 pr-9"
                      )
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {person.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-brand-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}