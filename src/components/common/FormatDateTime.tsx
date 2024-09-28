import React from "react";
import { IntlProvider, FormattedDate } from "react-intl";

interface IFormatDateTime {
  locale?: string;
  timeZone?: string;
  date: Date;
  format?: {
    day?: "numeric" | "2-digit",
    month?: "numeric" | "2-digit" | "short",
    year?: "numeric" | "2-digit",
    hour?: "numeric" | "2-digit",
    minute?: "numeric" | "2-digit"
  };
}

const FormatDateTime = ({
  locale = "en",
  timeZone = "en-US",
  date,
  format = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric"
  }
}: IFormatDateTime) => {
  return (
    <IntlProvider locale={locale} timeZone={timeZone}>
      <FormattedDate
        value={date}
        {...format}
      />
    </IntlProvider>
  )
}

export default FormatDateTime;