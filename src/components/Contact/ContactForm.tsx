import React, { MouseEventHandler } from "react";
import { useIntl } from "react-intl";
import { useFormik } from "formik";
import { IContact } from "./interfaces";
import InputField from "../FormHelpers/InputField";
import CountrySelectField from "../FormHelpers/CountrySelectField";
import LoadingBtn from "../Btn/LoadingBtn";
import * as Yup from "yup";

import messages from "../../i18n/messages";

interface IContactForm {
  contact: IContact;
  loading: boolean;
  handleClose: MouseEventHandler;
  handleSave: Function;
  focusFieldRef: any;
}

export default function ContactForm({
  contact,
  handleClose,
  focusFieldRef,
  handleSave,
  loading,
}: IContactForm) {
  const onSubmit = (variables: any): any => handleSave(formik.values);
  const { formatMessage: f } = useIntl();
  const validationSchema = Yup.object().shape({
    firstname: Yup.string(),
    lastname: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      ...contact,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  // const postcodeMasks: any = {
  //   AT: "9999",
  //   UK: "*** ***",
  // };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="card-body">
        <div className="md:grid md:grid-cols-4 md:gap-6">
          <InputField
            name="firstname"
            className="col-span-2 py-1"
            formik={formik}
            disabled={formik.isSubmitting}
            label={f(messages.firstname)}
          />
          <InputField
            name="lastname"
            className="col-span-2 py-1"
            formik={formik}
            disabled={formik.isSubmitting}
            label={f(messages.lastname)}
          />
          <InputField
            name="email"
            className="col-span-3 py-1"
            formik={formik}
            disabled={formik.isSubmitting}
            label={f(messages.email)}
          />
          <InputField
            name="phone"
            className="col-span-3 py-1"
            formik={formik}
            disabled={formik.isSubmitting}
            label={f(messages.phone)}
          />
          <InputField
            name="street"
            className="col-span-4 py-1"
            formik={formik}
            disabled={formik.isSubmitting}
            label={f(messages.street)}
          />
          <InputField
            name="postcode"
            className="md:col-span-1 py-1"
            formik={formik}
            number
            mask={"99999"}
            disabled={formik.isSubmitting}
            label={f(messages.postcode)}
          />
          <InputField
            name="city"
            className="md:col-span-3 py-1"
            formik={formik}
            disabled={formik.isSubmitting}
            label={f(messages.city)}
          />
          <CountrySelectField
            name="country"
            className="col-span-4 py-1"
            formik={formik}
            disabled={formik.isSubmitting}
            label={f(messages.country)}
          />
        </div>

        <div className="mt-5 sm:mt-4 sm:flex">
          <LoadingBtn
            loading={loading}
            onClick={onSubmit}
            color={"primary"}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-brand-500 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            disabled={!formik.dirty || loading}
          >
            {f(messages.save)}
          </LoadingBtn>

          <button
            type="button"
            ref={focusFieldRef}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white
                text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleClose}
          >
            {f(messages.cancel)}
          </button>
        </div>
      </div>
    </form>
  );
}
