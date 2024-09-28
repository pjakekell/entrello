import React from "react";
import { useIntl } from "react-intl";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_TAX_GROUP, FETCH_TAX_GROUPS, UPDATE_TAX_GROUP } from "./logic";
import { useFormik } from "formik";
import { ITaxGroup } from "./interfaces";
import * as Yup from "yup";
import InputField from "../FormHelpers/InputField";
import LoadingBtn from "../Btn/LoadingBtn";
import { CashIcon } from "@heroicons/react/outline";
import { classNames } from "../../utils/misc";
import InsetInputField from "../FormHelpers/InsetInputField";

import messages from "../../i18n/messages";
import { useNavigate } from "react-router-dom";

interface IEditTaxGroupForm {
  tax: ITaxGroup;
  isModal?: boolean;
  handleCloseTaxModalClose?: (newValue?: string) => void;
}

export default function EditTaxGroupForm({ tax, isModal = false, handleCloseTaxModalClose }: IEditTaxGroupForm) {
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();
  const [createTaxGroup, { loading: creating }] = useMutation(CREATE_TAX_GROUP);
  const [updateTaxGroup, { loading: updating }] = useMutation(UPDATE_TAX_GROUP);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(f(messages.nameRequired)),
    tax_rate: Yup.number()
      .min(0)
      .max(100)
      .required(f(messages.taxRateRequired)),
  });
  const formik = useFormik({
    initialValues: {
      ...tax,
    },
    validationSchema,
    onSubmit,
  });

  const create = async () => {
    try {
      const { data } = await createTaxGroup({
        variables: {
          ...formik.values,
        },
        refetchQueries: [
          {
            query: FETCH_TAX_GROUPS,
          },
        ],
      });
      if (data.CreateTaxGroup) {

        isModal ? (handleCloseTaxModalClose && handleCloseTaxModalClose(data.CreateTaxGroup.id)) : navigate(`/settings/taxes`);
        return;
      }
      console.error("unexpected return value from server", data);
    } catch (e) {
      console.error(e);
    }
  };

  const save = async () => {
    try {
      const { data } = await updateTaxGroup({
        variables: {
          ...formik.values,
        },
      });
      if (data.UpdateTaxGroup) {
        isModal ? (handleCloseTaxModalClose && handleCloseTaxModalClose(data.UpdateTaxGroup.id)) : navigate(`/settings/taxes`);
        return;
      }
      console.error("unexpected return value from server", data);
    } catch (e) {
      console.error(e);
    }
  };

  function onSubmit() {
    if (tax && tax.id) {
      save();
      return;
    }
    create();
  }

  const handleBackToTaxGroups = () => {
    isModal ? (handleCloseTaxModalClose && handleCloseTaxModalClose()) : navigate(`/settings/taxes`);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <div>
          <InputField
            name="name"
            className="mb-4 col-span-6 py-4"
            formik={formik}
            onBlur={false}
            disabled={updating || creating}
            placeholder={f(messages.taxName)}
            label={f(messages.taxName)}
            cornerHint={f(
              { id: "{count} characters remaining" },
              {
                count: 70 - formik.values.name.length,
                b: (...chunks) => <b key="ttt">{chunks}</b>,
              }
            )}
          />
          <InsetInputField
            name="tax_rate"
            className="mb-4 col-span-6 py-4"
            icon={<CashIcon className="h-5 w-5 text-gray-400" />}
            formik={formik}
            placeholder={"e.g. 10 %"}
            number
            percent
            disabled={updating || creating}
            label={f(messages.taxRate)}
          />
        </div>
        <div className="mt-5 sm:mt-4 sm:flex">
          <LoadingBtn
            loading={updating || creating}
            onClick={onSubmit}
            type="submit"
            className={classNames(
              "focus:outline-none focus:ring-2 focus:ring-offset-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
              !formik.dirty || !formik.isValid || updating || creating
                ? "bg-gray-200 hover:bg-gray-700 focus:ring-gray-500"
                : "bg-brand-500 hover:bg-brand-700 focus:ring-brand-500"
            )}
            disabled={!formik.dirty || !formik.isValid || updating || creating}
          >
            {f(messages[tax && tax.id ? "save" : "create"])}
          </LoadingBtn>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleBackToTaxGroups}
          >
            {f(messages.cancel)}
          </button>
        </div>
      </div>
    </form>
  );
}
