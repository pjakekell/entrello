import React from "react";
import "dayjs/locale/de";
import { DatePicker } from "@mantine/dates";
import { NavLink } from "react-router-dom";
import { useIntl } from "react-intl";
import { lang } from "../../../locale";
import messages from "../../../i18n/messages.js";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePickerStyles } from "./config";
import { CalendarIcon } from "@heroicons/react/outline";

export default function EventsListingHeader({ formik }: any) {
  const { formatMessage: f } = useIntl();

  const onSubmit = () => {
    const variables: any = {};
    const from = formik.values.fromEventFilter;
    if (from && from instanceof Date) {
      variables.from = from.getTime() / 1000;
    }
  };

  const handleChangeFromDate = (d: Date) => {
    if (!d) {
      formik.setFieldValue("fromEventFilter", null);
      localStorage.removeItem("fromEventFilter");
      return;
    }
    if (
      !formik.values.fromEventFilter ||
      d.getTime() === formik.values.fromEventFilter.getTime()
    )
      return;

    formik.setFieldValue("fromEventFilter", d);
    localStorage.setItem("fromEventFilter", d.getTime().toString());
    onSubmit();
  };

  const handleChangeToDate = (d: Date) => {
    if (!d) {
      formik.setFieldValue("toEventFilter", null);
      localStorage.removeItem("toEventFilter");
      return;
    }
    if (
      !formik.values.toEventFilter ||
      d.getTime() === formik.values.toEventFilter.getTime()
    )
      return;

    formik.setFieldValue("toEventFilter", d);
    localStorage.setItem("toEventFilter", d.getTime().toString());
    onSubmit();
  };

  return (
    <div className="lg:flex lg:justify-between lg:items-start p-2 sm:p-6">
      <div className="min-w-0">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate">
          {f(messages.events)}
        </h2>
        <form
          onSubmit={onSubmit}
          className="flex justify-center lg:mt-0 space-x-6"
        >
          <div className="flex items-center">
            <DatePicker
              name="from"
              locale={lang}
              allowFreeInput
              variant="unstyled"
              placeholder="Pick date"
              icon={<CalendarIcon className="h-5 w-5 text-gray-300" />}
              inputFormat="DD.MM.YYYY"
              labelFormat="DD.MM.YYYY"
              value={formik.values.fromEventFilter}
              onChange={(value: Date) => {
                handleChangeFromDate(value);
              }}
              styles={DatePickerStyles}
              classNames={{
                root: "flex items-center",
                label: "text-gray-500 text-xs p-0 m-0 leading-none uppercase",
                input: "h-8 w-36 font-sans",
                placeholder: "font-sans",
              }}
            />
            <span>&ndash;</span>
            <DatePicker
              name="to"
              locale={lang}
              allowFreeInput
              variant="unstyled"
              placeholder="Pick date"
              icon={<CalendarIcon className="h-5 w-5 text-gray-300" />}
              inputFormat="DD.MM.YYYY"
              labelFormat="DD.MM.YYYY"
              value={formik.values.toEventFilter}
              onChange={(value: Date) => {
                handleChangeToDate(value);
              }}
              styles={DatePickerStyles}
              classNames={{
                root: "flex items-center",
                label: "text-gray-500 text-xs p-0 m-0 leading-none uppercase",
                input: "h-8 w-36 font-sans",
                placeholder: "font-sans",
              }}
            />
          </div>
        </form>
      </div>
      <div className="flex items-center">
        <NavLink to="/events/new">
          <button
            type="button"
            className="inline-flex items-center justify-center sm:justify-start text-center sm:text-left px-2 sm:px-4 sm:py-1.5 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="sm:mr-2 h-4 w-4"
              aria-hidden="true"
            />
            <span className="uppercase hidden sm:inline">
              {f(messages.newEvent)}
            </span>
          </button>
        </NavLink>
      </div>
    </div>
  );
}
