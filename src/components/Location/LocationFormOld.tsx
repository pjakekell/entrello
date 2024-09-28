import React, { MouseEventHandler } from "react";
import { useIntl } from "react-intl";
import { useFormik } from "formik";
import { ILocation } from "./interfaces";
import InputField from "../FormHelpers/InputField";
import CountrySelectField from "../FormHelpers/CountrySelectField";
import LoadingBtn from "../Btn/LoadingBtn";
import { Switch } from "@headlessui/react";
import { classNames } from "../../utils/misc";

import messages from "../../i18n/messages";

interface ILocationForm {
  location: ILocation;
  loading: boolean;
  handleClose: MouseEventHandler;
  handleSave: Function;
  focusFieldRef: any;
}

const ToggleSeatingPlanSwitch = ({ formik }: any) => {
  const { formatMessage: f } = useIntl();

  const handleToggleFeatureSeatingPlan = () =>
    formik.setFieldValue(
      "featureSeatingPlan",
      !formik.values.featureSeatingPlan
    );

  return (
    <div className="col-span-6 py-1">
      <Switch.Group as="div" className="flex justify-between">
        <Switch
          checked={formik.featureSeatingPlan}
          onChange={handleToggleFeatureSeatingPlan}
          className={classNames(
            formik.values.featureSeatingPlan ? "bg-brand-600" : "bg-gray-200",
            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              formik.values.featureSeatingPlan
                ? "translate-x-5"
                : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
            )}
          />
        </Switch>
        <div
          className="flex-grow flex flex-col ml-6 cursor-pointer"
          onClick={handleToggleFeatureSeatingPlan}
        >
          <Switch.Label
            as="span"
            className="text-sm font-medium text-gray-900"
            passive
          >
            {f(messages.seatingPlan)}
          </Switch.Label>
          <Switch.Description as="span" className="text-sm text-gray-500">
            {f(messages.seatingPlanSwitchDesc)}
          </Switch.Description>
        </div>
      </Switch.Group>
    </div>
  );
};

export default function LocationForm({
  location,
  handleClose,
  focusFieldRef,
  handleSave,
  loading,
}: ILocationForm) {
  const onSubmit = (variables: any): any => handleSave(formik.values);
  const { formatMessage: f } = useIntl();
  const formik = useFormik({
    initialValues: {
      ...location,
    },
    enableReinitialize: true,
    validate,
    onSubmit,
  });

  const postcodeMasks: any = {
    AT: "9999",
    UK: "*** ***",
  };

  function validate(values: any) {
    const errors = { title: "" };
    if (!values.title) errors.title = "required";
    return errors;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="card-body">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <InputField
            name="name"
            className="col-span-6 py-1"
            formik={formik}
            refField={focusFieldRef}
            disabled={formik.isSubmitting}
            placeholder={f(messages.locationNamePlaceholder)}
            label={f(messages.name)}
            cornerHint={f(
              { id: "{count} characters remaining" },
              {
                count: 70 - formik.values.name.length,
                b: (...chunks) => <b key="ttt">{chunks}</b>,
              }
            )}
          />
          <InputField
            name="street"
            className="col-span-6 py-1"
            formik={formik}
            disabled={formik.isSubmitting}
            label={f(messages.street)}
          />
          <InputField
            name="postcode"
            className="col-span-6 sm:col-span-2 py-1"
            formik={formik}
            number
            mask={postcodeMasks[formik.values.country] || "99999"}
            disabled={formik.isSubmitting}
            label={f(messages.postcode)}
          />
          <InputField
            name="city"
            className="col-span-6 sm:col-span-4 py-1"
            formik={formik}
            disabled={formik.isSubmitting}
            label={f(messages.city)}
          />
          <CountrySelectField
            name="country"
            className="col-span-6 py-1"
            formik={formik}
            disabled={formik.isSubmitting}
            label={f(messages.country)}
          />
          <ToggleSeatingPlanSwitch formik={formik} />
        </div>

        <div className="mt-5 sm:mt-4 sm:flex">
          <LoadingBtn
            loading={loading}
            onClick={onSubmit}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-500 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            disabled={!formik.dirty || loading}
          >
            {f(messages.create)}
          </LoadingBtn>

          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleClose}
          >
            {f(messages.cancel)}
          </button>
        </div>
      </div>
    </form>
  );
}
