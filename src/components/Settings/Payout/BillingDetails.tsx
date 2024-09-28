import React from "react";
import { useIntl } from "react-intl";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { oidFromJWT, FETCH_ORG_BY_ID, UPDATE_ORG } from "../../Org/logic";
// import LoadingContainer from "../LoadingContainer";
// import logger from "../../utils/logger";
import messages from "../../../i18n/messages";
import * as Yup from "yup";
import { useFormik } from "formik";
import countries from "i18n-iso-countries";
import { lang } from "../../../locale";
// import IBAN from "iban";
// import { isString } from "lodash";
// import validateVat, {ViesValidationResponse} from 'validate-vat-ts';
import InputMask from "react-input-mask";
import { Tooltip } from "@mantine/core";
import SaveBtn from "../SaveBtn";
import { InformationCircleIcon } from "@heroicons/react/outline";

const BillingDetails = () => {
  const { formatMessage: f } = useIntl();
  const countryList = [
    { code: "AT", name: countries.getName("AT", lang) },
    { code: "DE", name: countries.getName("DE", lang) },
    { code: "CH", name: countries.getName("CH", lang) },
    { code: "GB", name: countries.getName("GB", lang) },
    { code: "SI", name: countries.getName("SI", lang) },
    { code: "HR", name: countries.getName("HR", lang) },
    { code: "HU", name: countries.getName("HU", lang) },
    { code: "CZ", name: countries.getName("CZ", lang) },
    { code: "SK", name: countries.getName("SK", lang) },
    { code: "PL", name: countries.getName("PL", lang) },
  ];
  const oid = oidFromJWT();
  const [saveOrg] = useMutation(UPDATE_ORG);
  const variables = { id: oid };
  const { data } = useQuery(FETCH_ORG_BY_ID, { variables });
  const org = data && data.org ? data.org : null;
  const info = org ? org.company_info : null;
  const formik = useFormik({
    initialValues: {
      name: info ? info.name : "",
      city: info && info.address ? info.address.city : "",
      country: info && info.address ? info.address.country : "DE",
      street: info && info.address ? info.address.street : "",
      postcode: info && info.address ? info.address.postcode : "",
      vat_id: info ? info.vat_id : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      vat_id: Yup.string().required("Required"),
      name: Yup.string().required(f(messages.nameRequired)),
      country: Yup.string().required(),
      street: Yup.string().required(),
      city: Yup.string().required(),
      postcode: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      console.log("onSubmit", values);
      try {
        const {
          data: { updateOrg: org },
        } = await saveOrg({
          variables: {
            input: {
              company_info: {
                name: values.name,
                vat_id: values.vat_id,
                address: {
                  street: values.street,
                  postcode: values.postcode,
                  country: values.country,
                  city: values.city,
                },
              },
            },
            id: oid,
          },
        });
        console.log("response org", org);
      } catch (e) {
        console.log("caught", e);
      }
    },
  });

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-3">
          <div className="flex items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {f(messages.billingDetails)}
            </h3>
            <Tooltip
              wrapLines
              width={220}
              withArrow
              transition="fade"
              position="right"
              transitionDuration={200}
              label={f(messages.billingDetailsDesc)}
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
                  {f(messages.name)}
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="disabled"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                />
                {formik.touched.name && formik.errors.name ? (
                  <p className="mt-2 text-sm text-red-600" id="name-error">
                    {formik.errors.name}
                  </p>
                ) : null}
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700"
                >
                  {f(messages.street)}
                </label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.street}
                  autoComplete="street"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                />
                {formik.touched.street && formik.errors.street ? (
                  <p className="mt-2 text-sm text-red-600" id="street-error">
                    {formik.errors.street}
                  </p>
                ) : null}
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  htmlFor="postcode"
                  className="block text-sm font-medium text-gray-700"
                >
                  {f(messages.postcode)}
                </label>
                <input
                  type="text"
                  name="postcode"
                  id="postcode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.postcode}
                  autoComplete="postal-code"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                />
                {formik.touched.postcode && formik.errors.postcode ? (
                  <p className="mt-2 text-sm text-red-600" id="postcode-error">
                    {formik.errors.postcode}
                  </p>
                ) : null}
              </div>

              <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  {f(messages.city)}
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.city}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                />
                {formik.touched.city && formik.errors.city ? (
                  <p className="mt-2 text-sm text-red-600" id="city-error">
                    {formik.errors.city}
                  </p>
                ) : null}
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  {f(messages.countryRegion)}
                </label>
                <select
                  id="country"
                  name="country"
                  autoComplete="country"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.country}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  {countryList.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {formik.touched.country && formik.errors.country ? (
                  <p className="mt-2 text-sm text-red-600" id="country-error">
                    {formik.errors.country}
                  </p>
                ) : null}
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="vat_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  {f(messages.vatId)}
                </label>
                <InputMask
                  mask="aaa999999"
                  maskPlaceholder="_"
                  name="vat_id"
                  id="vat_id"
                  type="text"
                  autoComplete="disabled"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.vat_id}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                />
                {formik.touched.vat_id && formik.errors.vat_id ? (
                  <p className="mt-2 text-sm text-red-600" id="vat_id-error">
                    {formik.errors.vat_id}
                  </p>
                ) : null}
              </div>

              <SaveBtn />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;
