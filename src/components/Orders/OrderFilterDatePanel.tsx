import React, { useCallback } from "react";
import { FormikProps } from "formik";
import { ReplyIcon } from "@heroicons/react/solid";
import { useIntl } from "react-intl";

import SelectSeason from "../Events/EventsListingHeader/SelectSeason";
import RadioField from "../FormHelpers/RadioField";
import IconDatePicker from "../FormHelpers/IconDatePicker";

import messages from "../../i18n/messages";
import { faCalendar } from "@fortawesome/pro-light-svg-icons";

interface IOrderFilterDatePanelParams {
  props: FormikProps<any>;
  dateLimitOptions: {
    id: number;
    name: string;
  }[],
  dayLimitOptions: {
    id: number;
    name: string;
  }[],
  isRequired: boolean
};

export default function OrderFilterDatePanel({
  props,
  dateLimitOptions,
  dayLimitOptions,
  isRequired
}: IOrderFilterDatePanelParams) {
  const { formatMessage: f } = useIntl();

  const handleChangeRadioField = useCallback((name, value) => {
    props.setFieldValue("timeZoneGMT", false);
    props.setFieldValue("timeZoneUTC", false);
    props.setFieldValue(name, value);
  }, [props]);

  return (
    <div>
      <SelectSeason
        name="dateLimit"
        options={dateLimitOptions}
        value={props.values.dateLimit}
        props={props}
      />
      <div className="flex my-2">
        {
          props.values.dateLimit.name === "is in the last" ?
          <>
            <ReplyIcon className="w-4 rotate-180 mr-1 fill-brand-500"/>
            <input
              className="appearance-none block w-14 px-3 mr-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              name="dayLimitNum"
              type="number"
              onChange={(e) => props.setFieldValue("dayLimitNum", e.target.value)}
              value={props.values.dayLimitNum}
              required={isRequired}
            />
            <SelectSeason
              className="w-24"
              name="dayLimit"
              options={dayLimitOptions}
              value={props.values.dayLimit}
              props={props}
            />
          </> :
          props.values.dateLimit.name === "is between" ?
          <div className="flex items-center">
            <IconDatePicker
              onChange={(date) => {props.setFieldValue("dateStart", date)}}
              selected={props.values.dateStart}
              icon={faCalendar}
            />
            <span className="mx-2">and</span>
            <IconDatePicker
              onChange={(date) => {props.setFieldValue("dateEnd", date)}}
              selected={props.values.dateEnd}
              icon={faCalendar}
            />
          </div> :
          <>
            <IconDatePicker
              onChange={(date) => {props.setFieldValue("dateStart", date)}}
              selected={props.values.dateStart}
              icon={faCalendar}
            />
          </>
        }
      </div>
      <div className="flex">
        <label className="text-sm mr-4">
          {`${f(messages.timeZone)}:`}
        </label>
        <RadioField
          className="w-14 mr-2"
          name="timeZoneGMT"
          value={props.values.timeZoneGMT}
          onChange={handleChangeRadioField}
          small
          label="GMT+10"
        />
        <RadioField
          className="w-14"
          name="timeZoneUTC"
          value={props.values.timeZoneUTC}
          onChange={handleChangeRadioField}
          small
          label="UTC"
        />
      </div>
    </div>
  );
}