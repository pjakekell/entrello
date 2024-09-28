import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import messages from "../../../i18n/messages";
import { useIntl } from "react-intl";
import InputField from "../../FormHelpers/InputField";
import { isUndefined, pick } from "lodash";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_PRICE_TEMPLATE, FETCH_PRICE_TEMPLATES, IPriceTemplate, UPDATE_PRICE_TEMPLATE } from "./logic";
import LoadingBtn from "../../Btn/LoadingBtn";
import { classNames } from "../../../utils/misc";

export default function PriceTemplateForm({ handleClose, priceTemplate }: { handleClose: () => void, priceTemplate: IPriceTemplate }) {
  const { formatMessage: f } = useIntl();
  const [createPriceTemplate, { loading: creating }] = useMutation(CREATE_PRICE_TEMPLATE);
  const [updatePriceTemplate, { loading: updating }] = useMutation(UPDATE_PRICE_TEMPLATE);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(f(messages.nameRequired)),
    description: Yup.string()
  })

  const formik = useFormik({
    initialValues: {
      ...priceTemplate,
    },
    validationSchema,
    onSubmit,
  });

  const create = async () => {
    try {
      const input = pick(
        formik.values,
        "name",
        "description"
      );
      const { data } = await createPriceTemplate({
        variables: {
          input,
        },
        refetchQueries: [
          {
            query: FETCH_PRICE_TEMPLATES,
          }
        ],
      });
      if (data.CreatePriceTemplate) {
        handleClose();
        return;
      }
      console.error("unexpected return value from server", data);
    } catch (e) {
      console.error(e);
    }
  };


  const save = async () => {
      const { id } = priceTemplate;
      try {
        const input = pick(
          formik.values,
          "name",
          "description",
        );
        const { data } = await updatePriceTemplate({
          variables: {
            id,
            input
          },
          refetchQueries: [
            {
              query: FETCH_PRICE_TEMPLATES,
            }
          ],
        });
        if (data.UpdatePriceTemplate) {
          handleClose();
          return;
        }
        console.error("unexpected return value from server", data);
      } catch (e) {
        console.error(e);
      }
  };



  function onSubmit() {
    if (priceTemplate && priceTemplate.id) {
      save();
      return;
    }
    create();
  }
  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <InputField
          name="name"
          className="mb-2 col-span-6 py-2"
          formik={formik}
          onBlur={false}
          disabled={creating || updating}
          label={f(messages.priceTemplate)}
          cornerHint={f(
            { id: "{count} characters remaining" },
            {
              count:
                40 -
                (!isUndefined(formik.values.name)
                  ? formik.values.name.length
                  : 0),
                b: (...chunks) => <b key="ttt">{chunks}</b>,
            }
          )}
        />
        <InputField
          name="description"
          className="mb-2 py-2"
          formik={formik}
          disabled={creating || updating}
          label={f(messages.description)}
          cornerHint={f(
            { id: "{count} characters remaining" },
            {
              count:
                40 -
                (!isUndefined(formik.values.description)
                  ? formik.values.description.length
                  : 0),
              b: (...chunks) => <b key="ttt">{chunks}</b>,
            }
          )}
        />
      </div>
      <div className="mt-5 sm:mt-4 sm:flex">
        <LoadingBtn
          loading={updating || creating}
          type="submit"
          className={classNames(
            "focus:outline-none focus:ring-2 focus:ring-offset-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
            !formik.dirty || !formik.isValid || updating || creating
              ? "bg-gray-200 hover:bg-gray-700 focus:ring-gray-500"
              : "bg-brand-500 hover:bg-brand-700 focus:ring-brand-500"
          )}
          disabled={!formik.dirty || !formik.isValid || updating || creating}
        >
          {f(messages[priceTemplate && priceTemplate.id ? "save" : "create"])}
        </LoadingBtn>
        <button
          type="submit"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={handleClose}
        >
          {f(messages.cancel)}
        </button>
      </div>
    </form>
  )
}