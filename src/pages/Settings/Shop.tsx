import React from "react";
import { useIntl } from "react-intl";
import { SettingsLayout } from "../../components/Layout/SettingsLayout";
import messages from "../../i18n/messages";
import { Tooltip } from "@mantine/core";
import toast, { Toaster } from "react-hot-toast";
import { Form, Formik, FormikProps } from "formik";
import { toastStyle } from "../../utils/styles";
import { TextInput } from "../../components/FormHelpers/TextInput";
import { useOrgInfo } from "../../hooks/useOrgInfo";
import * as Yup from "yup";
import { useMutation } from "@apollo/client";
import { UPDATE_COMPANY_INFO } from "../../graphql/mutations";
import LoadingIcon from "../../components/Btn/LoadingIcon";
import colors from "../../utils/colors";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { slugify } from "../../utils/slugify";

const BreadcrumbConfig = {
  links: [
    {
      to: "/settings",
      text: messages.settings,
    },
    {
      to: "/settings/shop",
      text: messages.shop,
    },
  ],
};

export function Shop() {
  const { formatMessage: f } = useIntl();
  const { dataOrgInfo } = useOrgInfo();
  const [UpdateOrg] = useMutation(UPDATE_COMPANY_INFO);

  const shopSchema = Yup.object().shape({
    slug: Yup.string(),
  });

  const initialValues = {
    slug: dataOrgInfo?.org.slug || "",
  };

  const onSubmit = (values: any) => {
    toast.promise(
      UpdateOrg({
        variables: {
          id: dataOrgInfo?.org.id,
          input: {
            slug: slugify(values.slug, "-"),
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

  const slugLink = (props: any) =>
    `https://shop.entrello.io/${slugify(props.values.slug, "-")}`;

  return (
    <>
      <SettingsLayout title={f(messages.shop)} config={BreadcrumbConfig}>
        {dataOrgInfo ? (
          <Formik
            initialValues={initialValues}
            validationSchema={shopSchema}
            onSubmit={onSubmit}
          >
            {(props: FormikProps<any>) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-4 gap-6">
                  <div className="col-span-4">
                    <TextInput
                      htmlFor="slug"
                      type="text"
                      name="slug"
                      label={f(messages.slug)}
                      props={props}
                    >
                      <Tooltip
                        wrapLines
                        width={400}
                        withArrow
                        transition="fade"
                        position="right"
                        transitionDuration={200}
                        label={f(messages.slugDetails)}
                      >
                        <InformationCircleIcon
                          className="flex-shrink-0 ml-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Tooltip>
                    </TextInput>
                  </div>
                  <div className="col-span-4">
                    <h3 className="text-gray-400 text-xs uppercase">
                      {f(messages.slugPreview)}
                    </h3>
                    <div className="text-gray-500">
                      <a href={slugLink(props)}>{slugLink(props)}</a>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
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
        ) : (
          <div className="text-center my-28">
            <div className="flex justify-center mt-4">
              <LoadingIcon color={colors.brand[500]} size={80} />
            </div>
            <div className="font-bold text-xs uppercase text-brand-500 mt-4 tracking-wide">
              {f(messages.loading)}
            </div>
          </div>
        )}
      </SettingsLayout>
      <Toaster position="top-right" />
    </>
  );
}
