import React from "react";
import { useState } from "react";
import { SelectorIcon } from "@heroicons/react/solid";
import { useClickOutside } from "@mantine/hooks";
import { XIcon } from "@heroicons/react/outline";
import { FormikProps } from "formik";

type SelectedProps = {
  name: string;
};

type DropdownSelectPros = {
  name: string;
  label: string;
  options: {
    name: string;
  }[];
  value: SelectedProps[];
  props: FormikProps<any>;
};

export function DropdownSelect({
  name: dropDownName,
  label,
  options,
  value,
  props,
}: DropdownSelectPros) {
  const [selected, setSelected] = useState<SelectedProps[]>(value);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const ref = useClickOutside(() => setDropdownIsOpen(false));

  const notSelected = options.filter(
    ({ name: id1 }) => !selected.some(({ name: id2 }) => id2 === id1)
  );

  function handleToggleModal() {
    return setDropdownIsOpen(!dropdownIsOpen);
  }

  function handleAdd(option: SelectedProps) {
    if (!selected.some((item) => item.name === option.name)) {
      setSelected([...selected, option]);
      localStorage.setItem(dropDownName, JSON.stringify([...selected, option]));
      props.setFieldValue(dropDownName, [...selected, option]);
    }
  }

  function handleDelete(name: string) {
    const newList = selected.filter((item) => item.name !== name);
    setSelected(newList);
    localStorage.setItem(dropDownName, JSON.stringify(newList));
    props.setFieldValue(dropDownName, newList);
  }

  return (
    <div className="flex flex-col">
      <label className="mb-1 text-xs font-medium" htmlFor="labels">
        {label}
      </label>
      <div
        tabIndex={2}
        ref={ref}
        className="relative max-h-9 flex justify-between bg-white w-full p-2 rounded-full border border-gray-300 focus:border-indigo-400 ring-indigo-400"
      >
        <div
          onClick={handleToggleModal}
          className="w-full flex overflow-hidden space-x-2"
          style={{
            WebkitMaskImage: "linear-gradient(90deg, #000 60%, transparent)",
          }}
        >
          {selected.length === 0 ? (
            <p className="text-sm text-gray-400">Select...</p>
          ) : null}
          {selected.map((item) => {
            return (
              <div
                key={item.name}
                className="flex items-center bg-gray-50 rounded-sm"
              >
                <div className=" text-xs font-medium px-1 cursor-default whitespace-nowrap">
                  {item.name}
                </div>
              </div>
            );
          })}
        </div>
        <div onClick={handleToggleModal}>
          <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
        </div>
        {dropdownIsOpen ? (
          <div className="absolute z-10 left-0 top-10 bg-white w-48 p-2 rounded shadow-sm">
            <div>
              <p className="text-xs my-2 text-gray-400 uppercase border-b">
                Selected
              </p>
              <ul>
                {selected.map((option) => {
                  return (
                    <div className="flex justify-between" key={option.name}>
                      <li
                        onClick={() => handleAdd(option)}
                        className="cursor-default w-full hover:bg-indigo-200 px-2 transition-all text-gray-900"
                      >
                        {option.name}
                      </li>
                      <button
                        className="bg-gray-50 hover:bg-red-100 transition-all"
                        onClick={() => handleDelete(option.name)}
                      >
                        <XIcon
                          className="w-3 h-3 text-gray-400"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  );
                })}
              </ul>
            </div>
            <div>
              <p className="text-xs my-2 text-gray-400 uppercase border-b">
                Not selected
              </p>
              <ul>
                {notSelected.map((option) => {
                  return (
                    <li
                      key={option.name}
                      onClick={() => handleAdd(option)}
                      className="cursor-default hover:bg-indigo-200 px-2 transition-all text-gray-900"
                    >
                      {option.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
