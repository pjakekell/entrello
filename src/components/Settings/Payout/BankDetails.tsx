import React from "react";
import { useIntl } from "react-intl";
import { Tooltip } from "@mantine/core";
// import { useQuery, useMutation } from "@apollo/react-hooks";
// import { oidFromJWT, FETCH_ORG_BY_ID, UPDATE_ORG } from "../Org/logic";
// import LoadingContainer from "../LoadingContainer";
// import logger from "../../utils/logger";
import messages from "../../../i18n/messages";
import * as Yup from "yup";
import { useFormik } from "formik";
// import IBAN from "iban";
// import { isString } from "lodash";
// import validateVat, {ViesValidationResponse} from 'validate-vat-ts';
import InputMask from "react-input-mask";
import SaveBtn from "../SaveBtn";
import { InformationCircleIcon } from "@heroicons/react/outline";

const BankDetails = () => {
  const { formatMessage: f } = useIntl();
  const currencyList = ["EUR", "CHF", "GBP"];

  const formik = useFormik({
    initialValues: {
      iban: "",
      bic: "",
      holder_name: "",
      name: "",
      currency: "EUR",
    },
    validationSchema: Yup.object({
      holder_name: Yup.string(),
      name: Yup.string(),
      iban: Yup.string().required("IBAN IS required"),
      // iban: Yup.string()
      //   .required("IBAN is required")
      //   .test("iban", "not a valid iban code", (value) =>
      //     isString(value) ? IBAN.isValid(value) : false
      //   ),
    }),
    onSubmit: (values) => {
      console.log("formik", formik.values);
    },
  });

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-3">
          <div className="flex items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {f(messages.bankAccount)}
            </h3>
            <Tooltip
              wrapLines
              width={220}
              withArrow
              transition="fade"
              position="right"
              transitionDuration={200}
              label={f(messages.bankAccountDesc)}
            >
              <InformationCircleIcon
                className="flex-shrink-0 ml-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Tooltip>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-3">
          <form name="bank_account" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {f(messages.bankAccountName)}
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  id="name"
                  autoComplete="name"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {f(messages.bankAccountNameDesc)}
                </p>
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="iban"
                  className="block text-sm font-medium text-gray-700"
                >
                  {f(messages.iban)}
                </label>

                <InputMask
                  mask="aa99 9999 9999 9999 9999"
                  maskPlaceholder="_"
                  name="iban"
                  id="iban"
                  type="text"
                  autoComplete="disabled"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.iban}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                />
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="bic"
                  className="block text-sm font-medium text-gray-700"
                >
                  {f(messages.bic)}
                  <span className="font-light text-gray-500">
                    {" "}
                    ({f(messages.optional)})
                  </span>
                </label>
                <input
                  type="text"
                  name="bic"
                  id="bic"
                  autoComplete="disabled"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.bic}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="holder_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {f(messages.bankAccountHolderName)}
                </label>
                <input
                  type="text"
                  name="holder_name"
                  id="holder_name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.bic}
                  autoComplete="disabled"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="bank_account_currency"
                  className="block text-sm font-medium text-gray-700"
                >
                  {f(messages.currency)}
                </label>
                <select
                  id="bank_account_currency"
                  name="bank_account_currency"
                  autoComplete="country"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  {currencyList.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <SaveBtn />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
