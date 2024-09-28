import React from "react";
import { FormattedNumber } from "react-intl";

export const formatCurrency = {
  style: "currency",
  currency: "EUR",
};

interface ICurrencyParams {
  value: number;
  onClick?: (e: any) => void;
  className?: string;
  hideCurrency?: boolean;
}

export default function Currency({
  value,
  hideCurrency,
  className,
  onClick,
}: ICurrencyParams) {
  const opts = {
    ...formatCurrency,
  } as any;
  if (hideCurrency) {
    opts.style = "decimal";
    opts.currency = undefined;
    opts.currencyDisplay = undefined;
    opts.minimumFractionDigits = 2;
    opts.maximumFractionDigits = 2;
  }
  return (
    <span onClick={onClick} className={className}>
      <FormattedNumber value={value / 100.0} {...opts} />
    </span>
  );
}
