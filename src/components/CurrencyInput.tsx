import React from "react";
import NumberFormat from "react-number-format";

interface ICurrencyField {
  formik: any;
  onBlur?: (e: any) => void;
  name: string;
  disabled?: boolean;
  inputRef: any;
  className?: string;
}

export default function CurrencyField({
  formik,
  className,
  onBlur,
  disabled = false,
  inputRef,
  name,
}: ICurrencyField) {
  const handleChange = ({ value }: any) => {
    formik.setFieldValue(name, Math.round(parseFloat(value) * 100).toString());
    return;
  };

  return (
    <NumberFormat
      value={formik.values[name] / 100.0}
      decimalSeparator=","
      fixedDecimalScale
      decimalScale={2}
      onValueChange={handleChange}
      onBlur={onBlur}
      onClick={(e: any) => e.target.select()}
      disabled={disabled}
      getInputRef={inputRef}
      className={className}
    />
  );
}
