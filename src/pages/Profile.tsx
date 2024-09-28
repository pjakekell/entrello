import { useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import { SettingsLayout } from "../components/Layout/SettingsLayout";
import { Field, Form, Formik, FormikProps } from "formik";
import { UPDATE_USER } from "../graphql/mutations";
import { useUser } from "../hooks/useUser";
import { lang } from "../locale";
import toast from "react-hot-toast";
import { TextInput } from "../components/FormHelpers/TextInput";
import messages from "../i18n/messages";
import { useIntl } from "react-intl";
import * as Yup from "yup";
import { AddressForm } from "../components/FormHelpers/AddressForm";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { toastStyle } from "../utils/styles";
import LoadingIcon from "../components/Btn/LoadingIcon";
import colors from "../utils/colors";

interface IBasicFormProps {
  setModalIsOpen: (modalIsOpen: boolean) => void;
}

const ExtUserForm = () => {
  const { dataUserId } = useUser();
  const [UpdateUser] = useMutation(UPDATE_USER);
  const { formatMessage: f } = useIntl();

  const personalInfoSchema = Yup.object().shape({
    firstname: Yup.string(),
    lastname: Yup.string(),
    phone: Yup.string(),
    streetAddress: Yup.string(),
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

  const onSubmit = (values: any) => {
    toast.promise(
      UpdateUser({
        variables: {
          id: dataUserId?.user.id,
          input: {
            lang: values.language,
            firstname: values.firstname,
            lastname: values.lastname,
            phone: values.phone,
            address: {
              street: values.streetAddress,
              city: values.city,
              country: values.country,
              postcode: values.postcode,
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
    <div className="">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="mt-5 md:mt-0 md:col-span-3">
          <Formik
            initialValues={{
              language: lang,
              firstname: dataUserId?.user.firstname,
              lastname: dataUserId?.user.lastname,
              phone: dataUserId?.user.phone,
              streetAddress: dataUserId?.user.address.street,
              city: dataUserId?.user.address.city,
              country: dataUserId?.user.address.country,
              postcode: dataUserId?.user.address.postcode,
            }}
            validationSchema={personalInfoSchema}
            onSubmit={onSubmit}
          >
            {(props: FormikProps<any>) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3">
                    <TextInput
                      htmlFor="firstname"
                      type="text"
                      name="firstname"
                      label={f(messages.firstname)}
                      props={props}
                    />
                  </div>

                  <div className="col-span-3">
                    <TextInput
                      htmlFor="lastname"
                      label={f(messages.lastname)}
                      type="text"
                      name="lastname"
                      props={props}
                    />
                  </div>

                  <div className="col-span-3">
                    <TextInput
                      htmlFor="phone"
                      label={f(messages.phone)}
                      type="text"
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
    </div>
  );
};

const BasicForm = ({ setModalIsOpen }: IBasicFormProps) => {
  const { dataUserId } = useUser();
  const { formatMessage: f } = useIntl();

  const profileSchema = Yup.object().shape({
    email: Yup.string()
      .email(f(messages.invalidEmailError))
      .required(f(messages.emailIsRequired)),
  });

  const [UpdateUser] = useMutation(UPDATE_USER);

  const onSubmit = (values: any) => {
    toast
      .promise(
        UpdateUser({
          variables: {
            id: dataUserId?.user.id,
            input: {
              lang: values.language,
              email: values.email,
            },
          },
        }),
        {
          loading: "Loading",
          success: "Saved",
          error: "Error",
        },
        {
          style: {
            borderRadius: "6px",
            color: "#4B5563",
            fontSize: "14px",
            minWidth: "200px",
            display: "flex",
            fontWeight: "500",
            textAlign: "left",
          },
        }
      )
      .then(() => {
        localStorage.setItem("locale", values.language);
        window.location.reload();
      });
  };

  return (
    <div className="">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="mt-5 md:mt-0 md:col-span-3">
          <Formik
            initialValues={{
              language: dataUserId?.user.lang.toLowerCase(),
              email: dataUserId?.user.email,
            }}
            validationSchema={profileSchema}
            onSubmit={onSubmit}
          >
            {(props: FormikProps<any>) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-3">
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {f(messages.language)}
                    </label>
                    <Field
                      as="select"
                      id="language"
                      name="language"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                    >
                      <option value="en">English</option>
                      <option value="de">German</option>
                    </Field>
                  </div>

                  <div className="col-span-3">
                    <TextInput
                      htmlFor="email"
                      label={f(messages.email)}
                      type="email"
                      name="email"
                      props={props}
                    />
                  </div>

                  <div className="col-span-3">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {f(messages.profilePicture)}
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex items-center">
                        <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                        <button
                          type="button"
                          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          {f(messages.change)}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    className="font-medium flex text-sm text-orange-600 col-span-3"
                    type="button"
                    onClick={() => setModalIsOpen(true)}
                  >
                    {f(messages.changePassword)}
                  </button>
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
    </div>
  );
};

const BreadcrumbConfig = {
  links: [
    {
      to: "/settings",
      text: messages.settings,
    },
    {
      to: "/settings/profile",
      text: messages.profile,
    },
  ],
};

export function Profile() {
  const { dataUserId } = useUser();
  const { formatMessage: f } = useIntl();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <SettingsLayout config={BreadcrumbConfig} title={f(messages.profile)}>
      {dataUserId ? (
        <BasicForm setModalIsOpen={setModalIsOpen} />
      ) : (
        <LoadingIcon color={colors.brand[500]} size={80} />
      )}
      <h3 className="font-medium text-lg text-gray-600">
        {f(messages.personalInformation)}
      </h3>
      {dataUserId ? (
        <ExtUserForm />
      ) : (
        <LoadingIcon color={colors.brand[500]} size={80} />
      )}
      <ChangePasswordModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
    </SettingsLayout>
  );
}
