import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Form, Formik, FormikProps } from "formik";
import { TextInput } from "../FormHelpers/TextInput";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { UPDATE_PASSWORD } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";

interface IChangePasswordModalProps {
  modalIsOpen: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
}

export function ChangePasswordModal({
  modalIsOpen,
  setModalIsOpen,
}: IChangePasswordModalProps) {
  const { formatMessage: f } = useIntl();

  const passwordSchema = Yup.object({
    password: Yup.string()
      .required(f(messages.passwordIsRequired))
      .matches(/^.{6,}$/, f(messages.invalidPasswordError)),
    confirmPassword: Yup.string()
      .required(f(messages.confirmPasswordIsRequired))
      .oneOf([Yup.ref("password")], f(messages.confirmPasswordError)),
  });

  type changePasswordProps = {
    password: string;
    confirmPassword: string;
  };

  function onSubmit(values: changePasswordProps) {
    toast
      .promise(
        UpdatePassword({
          variables: {
            new_password: values.password,
            confirm_password: values.confirmPassword,
          },
        }),
        {
          loading: "Loading",
          success: "Saved!",
          error: "Error",
        }
      )
      .then(() => {
        setModalIsOpen(false);
      });
  }

  const [UpdatePassword] = useMutation(UPDATE_PASSWORD);

  return (
    <>
      <Transition.Root show={modalIsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setModalIsOpen}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity backdrop-filter backdrop-blur" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all w-full sm:my-8 sm:align-middle sm:max-w-xl sm:h-full sm:p-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl md:text-3xl leading-6 font-medium text-gray-900"
                    >
                      {f(messages.changePassword)}
                    </Dialog.Title>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row mt-10">
                  <Formik
                    initialValues={{
                      password: "",
                      confirmPassword: "",
                    }}
                    validateOnBlur={false}
                    validationSchema={passwordSchema}
                    onSubmit={onSubmit}
                  >
                    {(props: FormikProps<any>) => (
                      <Form className="space-y-6 w-full">
                        <div>
                          <TextInput
                            htmlFor="password"
                            name="password"
                            label={f(messages.password)}
                            type="password"
                            props={props}
                          />
                        </div>
                        <div>
                          <TextInput
                            htmlFor="confirmPassword"
                            name="confirmPassword"
                            label={f(messages.confirmPassword)}
                            type="password"
                            props={props}
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            onClick={() => setModalIsOpen(false)}
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
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setModalIsOpen(false)}
                  >
                    <XIcon
                      className="h-6 w-6 text-gray-600"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <Toaster position="top-right" />
    </>
  );
}
