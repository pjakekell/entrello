import React from "react";
import { TextInput } from "./TextInput";
import countries from "i18n-iso-countries";
import { lang } from "../../locale";
import messages from "../../i18n/messages";
import { useIntl } from "react-intl";
import { Field, FormikProps } from "formik";

interface IAddressForm {
  props: FormikProps<any>;
}

export function AddressForm({ props }: IAddressForm) {
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

  return (
    <>
      <div className="col-span-3">
        <TextInput
          htmlFor="streetAddress"
          label={f(messages.street)}
          type="text"
          name="streetAddress"
          id="streetAddress"
          autocomplete="street-address"
          props={props}
        />
      </div>

      <div className="col-span-3 lg:col-span-1">
        <TextInput
          htmlFor="city"
          label={f(messages.city)}
          type="text"
          name="city"
          id="city"
          autocomplete="address-level2"
          props={props}
        />
      </div>

      <div className="col-span-3 lg:col-span-1">
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700"
        >
          {f(messages.country)}
        </label>
        <Field
          as="select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          name="country"
          id="country"
        >
          {countryList.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </Field>
      </div>

      <div className="col-span-3 lg:col-span-1">
        <TextInput
          htmlFor="postcode"
          type="text"
          label={f(messages.postcode)}
          name="postcode"
          id="postcode"
          autocomplete="postcode"
          props={props}
        />
      </div>
    </>
  );
}
