import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { SettingsLayout } from "../../components/Layout/SettingsLayout";
import messages from "../../i18n/messages";
import { useMutation } from "@apollo/client";
import {
  FILE_UPLOAD,
  UPDATE_COMPANY_INFO,
  UPDATE_ORG_MEDIA,
} from "../../graphql/mutations";
import { useOrg } from "../../hooks/useOrg";
import { ChangeFileButton } from "../../components/Branding/changeFileButton";
import InputField from "../../components/FormHelpers/InputField";
import { useFormik } from "formik";
import { toastStyle } from "../../utils/styles";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";

const BreadcrumbConfig = {
  links: [
    {
      to: "/settings",
      text: messages.settings,
    },
    {
      to: "/settings/branding",
      text: messages.branding,
    },
  ],
};

export function Branding() {
  const { formatMessage: f } = useIntl();
  const [UpdateOrgMedia] = useMutation(UPDATE_ORG_MEDIA);
  const [FileUpload] = useMutation(FILE_UPLOAD);
  const [data] = useOrg();
  const [UpdateOrg] = useMutation(UPDATE_COMPANY_INFO);

  const inputFileMediaLogo = useRef<HTMLInputElement>(null);
  const inputFileMediaWebBg = useRef<HTMLInputElement>(null);
  const inputFileMediaTicketBg = useRef<HTMLInputElement>(null);
  const inputFileMediaVoucherBg = useRef<HTMLInputElement>(null);

  const [mediaLogo, setMediaLogo] = useState<File>();
  const [mediaWebBg, setMediaWebBg] = useState<File>();
  const [mediaTicketBg, setMediaTicketBg] = useState<File>();
  const [mediaVoucherBg, setMediaVoucherBg] = useState<File>();

  const validationSchema = Yup.object().shape({
    slug: Yup.string(),
  });

  const handleSubmitOrgForm = () => {
    toast.promise(
      UpdateOrg({
        variables: {
          id: data.id,
          input: {
            ...formik.values,
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

  const formik = useFormik({
    initialValues: {
      slug: data ? data.slug : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: handleSubmitOrgForm,
  });

  const handleSubmit = (
    fileState: File | undefined,
    mutationReference: string
  ) => {
    toast.promise(
      FileUpload({
        variables: {
          file: fileState,
        },
        onCompleted: (value) => {
          UpdateOrgMedia({
            variables: {
              id: data?.id,
              input: {
                [mutationReference]: value.FileUpload.url,
              },
            },
          });
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

  if (!data) return <></>;

  return (
    <>
      <SettingsLayout title={f(messages.branding)} config={BreadcrumbConfig}>
        <div>
          <div className="space-y-12">
            <form name="bank_account" onSubmit={formik.handleSubmit}>
              <InputField
                name="slug"
                className="mb-4 col-span-6 py-4"
                formik={formik}
                onBlur={formik.handleSubmit}
                label={f(messages.slug)}
                helperText={f(messages.slugDetails)}
                cornerHint={f(
                  { id: "{count} characters remaining" },
                  {
                    count: 70 - formik.values.slug.length,
                    b: (...chunks) => <b key="ttt">{chunks}</b>,
                  }
                )}
              />
            </form>
            <div className="col-span-3 space-y-4">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                {f(messages.orgLogo)}
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100">
                    {mediaLogo ? (
                      <img
                        src={URL.createObjectURL(mediaLogo)}
                        alt="with name"
                        className="h-full w-full object-scale-down"
                      />
                    ) : data?.media_logo_url ? (
                      <img
                        src={`https://${data?.media_logo_url}`}
                        alt="with name"
                        className="h-full w-full object-scale-down"
                      />
                    ) : null}
                  </div>

                  <ChangeFileButton
                    ref={inputFileMediaLogo}
                    setState={setMediaLogo}
                    mutationReference="media_logo_url"
                    handleSubmit={handleSubmit}
                  >
                    {f(messages.change)}
                  </ChangeFileButton>
                </div>
              </div>
            </div>

            <div className="col-span-3 space-y-4">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                Web Background
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100">
                    {mediaWebBg ? (
                      <img
                        src={URL.createObjectURL(mediaWebBg)}
                        alt="with name"
                        className="h-full w-full object-scale-down"
                      />
                    ) : data?.media_web_bg_url ? (
                      <img
                        src={`https://${data?.media_web_bg_url}`}
                        alt="with name"
                        className="h-full w-full object-scale-down"
                      />
                    ) : null}
                  </div>

                  <ChangeFileButton
                    ref={inputFileMediaWebBg}
                    setState={setMediaWebBg}
                    mutationReference="media_web_bg_url"
                    handleSubmit={handleSubmit}
                  >
                    {f(messages.change)}
                  </ChangeFileButton>
                </div>
              </div>
            </div>

            <div className="col-span-3 space-y-4">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                Ticket Background
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100">
                    {mediaTicketBg ? (
                      <img
                        src={URL.createObjectURL(mediaTicketBg)}
                        alt="with name"
                        className="h-full w-full object-scale-down"
                      />
                    ) : data?.media_ticket_bg_url ? (
                      <img
                        src={`https://${data?.media_ticket_bg_url}`}
                        alt="with name"
                        className="h-full w-full object-scale-down"
                      />
                    ) : null}
                  </div>

                  <ChangeFileButton
                    ref={inputFileMediaTicketBg}
                    setState={setMediaTicketBg}
                    mutationReference="media_ticket_bg_url"
                    handleSubmit={handleSubmit}
                  >
                    {f(messages.change)}
                  </ChangeFileButton>
                </div>
              </div>
            </div>

            <div className="col-span-3 space-y-4">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                Voucher Background
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100">
                    {mediaVoucherBg ? (
                      <img
                        src={URL.createObjectURL(mediaVoucherBg)}
                        alt="with name"
                        className="h-full w-full object-scale-down"
                      />
                    ) : data?.media_voucher_bg_url ? (
                      <img
                        src={`https://${data?.media_voucher_bg_url}`}
                        alt="with name"
                        className="h-full w-full object-scale-down"
                      />
                    ) : null}
                  </div>

                  <ChangeFileButton
                    ref={inputFileMediaVoucherBg}
                    setState={setMediaVoucherBg}
                    mutationReference="media_voucher_bg_url"
                    handleSubmit={handleSubmit}
                  >
                    {f(messages.change)}
                  </ChangeFileButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </SettingsLayout>
    </>
  );
}
