import React from "react";
import { AddressForm } from "../../components/FormHelpers/AddressForm";
import { UPDATE_COMPANY_INFO } from "../../graphql/mutations";
import messages from "../../i18n/messages";
import { useMutation } from "@apollo/client";
import { useIntl } from "react-intl";
import toast, { Toaster } from "react-hot-toast";
import { Form, Formik, FormikProps } from "formik";
import { TextInput } from "../../components/FormHelpers/TextInput";
import { useOrgInfo } from "../../hooks/useOrgInfo";
import * as Yup from "yup";
import { SettingsLayout } from "../../components/Layout/SettingsLayout";
import { toastStyle } from "../../utils/styles";
import LoadingIcon from "../../components/Btn/LoadingIcon";
import colors from "../../utils/colors";

const BreadcrumbConfig = {
  links: [
    {
      to: "/settings",
      text: messages.settings,
    },
    {
      to: "/settings/legal",
      text: messages.orgDetails,
    },
  ],
};

const ExtUserForm = () => {
  const [UpdateOrg] = useMutation(UPDATE_COMPANY_INFO);
  const { dataOrgInfo } = useOrgInfo();
  const { formatMessage: f } = useIntl();

  const organizationDetailsSchema = Yup.object().shape({
    companyName: Yup.string(),
    url: Yup.string(),
    supportUrl: Yup.string(),
    supportEmail: Yup.string(),
    supportPhone: Yup.string(),
    registrationNumber: Yup.string(),
    vatId: Yup.string(),
    businessType: Yup.number(),
    streetAddress: Yup.string(),
    email: Yup.string(),
    phone: Yup.string(),
    city: Yup.string(),
    country: Yup.string(),
    postcode: Yup.string()
      .when("country", {
        is: "AT",
        then: Yup.string().matches(
          /^[0-9]{4}$/,
          f(messages.invalidPostCodeError)
        ),
      })
      .when("country", {
        is: "DE",
        then: Yup.string().matches(
          /^[0-9]{5}$/,
          f(messages.invalidPostCodeError)
        ),
      })
      .when("country", {
        is: "CH",
        then: Yup.string().matches(
          /^[0-9]{4}$/,
          f(messages.invalidPostCodeError)
        ),
      })
      .when("country", {
        is: "GB",
        then: Yup.string().matches(
          /^[0-9A-Za-z ]{4,8}$/,
          f(messages.invalidPostCodeError)
        ),
      }),
  });

  const initialValues = {
    id: dataOrgInfo.org.id,
    companyName: dataOrgInfo?.org.company_info.name,
    url: dataOrgInfo?.org.company_info.url,
    supportUrl: dataOrgInfo?.org.company_info.support_url,
    supportEmail: dataOrgInfo?.org.company_info.support_email,
    supportPhone: dataOrgInfo?.org.company_info.support_phone,
    registrationNumber: dataOrgInfo?.org.company_info.registration_num,
    vatId: dataOrgInfo?.org.company_info.vat_id,
    businessType: dataOrgInfo?.org.company_info.business_type,
    email: dataOrgInfo?.org.company_info.address.email,
    phone: dataOrgInfo?.org.company_info.address.phone,
    streetAddress: dataOrgInfo?.org.company_info.address.street,
    city: dataOrgInfo?.org.company_info.address.city,
    country: dataOrgInfo?.org.company_info.address.country,
    postcode: dataOrgInfo?.org.company_info.address.postcode,
  };

  const onSubmit = (values: any) => {
    toast.promise(
      UpdateOrg({
        variables: {
          id: dataOrgInfo?.org.id,
          input: {
            company_info: {
              name: values.companyName,
              url: values.url,
              support_url: values.supportUrl,
              support_email: values.supportEmail,
              support_phone: values.supportPhone,
              vat_id: values.vatId,
              business_type: values.businessType,
              registration_num: values.registrationNumber,
              address: {
                email: values.email,
                phone: values.phone,
                street: values.streetAddress,
                city: values.city,
                country: values.country,
                postcode: values.postcode,
              },
            },
          },
        },
      }),
      {
        loading: "Loading",
        success: "Saved",
        error: "Error",
      },
      {
        style: toastStyle,
      }
    );
  };

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="mt-5 md:mt-0 md:col-span-3">
        <Formik
          initialValues={initialValues}
          validationSchema={organizationDetailsSchema}
          onSubmit={onSubmit}
        >
          {(props: FormikProps<any>) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-4">
                  <TextInput
                    disabled
                    htmlFor="org_id"
                    type="text"
                    name="id"
                    label="ID"
                    props={props}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-4">
                  <TextInput
                    htmlFor="companyName"
                    type="text"
                    name="companyName"
                    label={f(messages.companyName)}
                    props={props}
                  />
                </div>

                <div className="col-span-4">
                  <TextInput
                    htmlFor="url"
                    label={f(messages.url)}
                    type="text"
                    name="url"
                    props={props}
                  />
                </div>

                <div className="col-span-4">
                  <TextInput
                    htmlFor="supportUrl"
                    label={f(messages.supportURL)}
                    type="text"
                    name="supportUrl"
                    props={props}
                  />
                </div>

                <div className="col-span-4 lg:col-span-2">
                  <TextInput
                    htmlFor="supportEmail"
                    label={f(messages.supportEmail)}
                    type="text"
                    name="supportEmail"
                    props={props}
                  />
                </div>
                <div className="col-span-4 lg:col-span-2">
                  <TextInput
                    htmlFor="supportPhone"
                    label={f(messages.supportPhone)}
                    type="tel"
                    name="supportPhone"
                    props={props}
                  />
                </div>

                <div className="col-span-4 lg:col-span-2">
                  <TextInput
                    htmlFor="registrationNumber"
                    label={f(messages.registrationNumber)}
                    type="text"
                    name="registrationNumber"
                    props={props}
                  />
                </div>

                <div className="col-span-4 lg:col-span-2">
                  <TextInput
                    htmlFor="vatId"
                    label={f(messages.vatId)}
                    type="text"
                    name="vatId"
                    props={props}
                  />
                </div>

                <div className="col-span-4 lg:col-span-2">
                  <TextInput
                    htmlFor="businessType"
                    label={f(messages["Business type"])}
                    type="text"
                    name="businessType"
                    props={props}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3">
                  <TextInput
                    htmlFor="email"
                    type="email"
                    name="email"
                    label={f(messages.email)}
                    props={props}
                  />
                </div>

                <div className="col-span-3">
                  <TextInput
                    htmlFor="phone"
                    label={f(messages.phone)}
                    type="tel"
                    name="phone"
                    props={props}
                  />
                </div>

                <AddressForm props={props} />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  {f(messages.cancel)}
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  {f(messages.save)}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export function OrganizationDetails() {
  const { dataOrgInfo } = useOrgInfo();
  const { formatMessage: f } = useIntl();

  return (
    <>
      <SettingsLayout title={f(messages.orgDetails)} config={BreadcrumbConfig}>
        {dataOrgInfo ? (
          <ExtUserForm />
        ) : (
          <LoadingIcon color={colors.brand[500]} size={80} />
        )}
      </SettingsLayout>
      <Toaster position="top-right" />
    </>
  );
}
