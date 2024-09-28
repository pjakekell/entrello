import React, { useState } from "react";
import { classNames } from "../../utils/misc";
import { TwitterPicker, ColorResult } from "react-color";
import { priceColors } from "../../utils/colors";

interface IColorPicker {
  formik: any;
  name: string;
  label: string;
  className?: string;
  togglePicker?: (boolean: boolean) => void;
}

const ColorPickerForm = ({
  formik,
  togglePicker,
  label,
  name,
}: IColorPicker) => {
  const color =
    formik.values && formik.values[name] ? formik.values[name] : priceColors[0];

  const handleChange = (color: ColorResult) => {
    formik.setFieldValue(name, color.hex);
    togglePicker && togglePicker(false);
  };

  // const hidePicker = () => (togglePicker ? togglePicker(false) : null);

  return (
    <div>
      <div className="flex justify-between items-end">
        <label
          htmlFor={name}
          className="block text-sm font-normal text-gray-700"
        >
          {label}
        </label>
      </div>
      <TwitterPicker
        triangle="hide"
        width="100%"
        onChangeComplete={handleChange}
        color={color}
        colors={priceColors}
      />
    </div>
  );
};

const ColorPickerInfo = ({
  formik,
  label,
  name,
  togglePicker,
}: IColorPicker) => {
  const showPicker = () => (togglePicker ? togglePicker(true) : null);
  return (
    <div className="flex align-center">
      <div className="flex justify-between items-end">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      </div>
      <div
        className="w-5 h-5 block ml-4 ring ring-offset-2 ring-gray-400 rounded-full cursor-pointer"
        style={{ backgroundColor: formik.values[name] }}
        onClick={showPicker}
      />
    </div>
  );
};

const ColorPicker = ({ formik, className, label, name }: IColorPicker) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className={classNames(className)}>
      {showPicker ? (
        <ColorPickerForm
          formik={formik}
          label={label}
          name={name}
          togglePicker={setShowPicker}
        />
      ) : (
        <ColorPickerInfo
          formik={formik}
          label={label}
          name={name}
          togglePicker={setShowPicker}
        />
      )}
    </div>
  );
};

export default ColorPicker;
