import React from "react";
import { useIntl } from "react-intl";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_DEAL, UPDATE_DEAL } from "./logic";
import { useFormik } from "formik";
import { IDeal } from "./interfaces";
import * as Yup from "yup";
import InputField from "../FormHelpers/InputField";
import LoadingBtn from "../Btn/LoadingBtn";
import { CashIcon } from "@heroicons/react/outline";
import { classNames } from "../../utils/misc";
import InsetInputField from "../FormHelpers/InsetInputField";

import messages from "../../i18n/messages";
import { useNavigate } from "react-router-dom";
import { suFromJWT } from "../User/logic";
import { pick } from "lodash";

interface IEditDealForm {
  deal: IDeal;
}

export default function EditDealForm({ deal }: IEditDealForm) {
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();
  const [createDeal, { loading: creating }] = useMutation(CREATE_DEAL);
  const [updateDeal, { loading: updating }] = useMutation(UPDATE_DEAL);
  const validationSchema = Yup.object().shape({
    description: Yup.string().required(f(messages.nameRequired)),
    reseller_org_id: Yup.string().required(f(messages.dealPartnerIdRequired)),
    cr: Yup.number().min(0),
    sf: Yup.number().min(0),
    deal_service_rate: Yup.number().min(0).max(100),
  });
  const formik = useFormik({
    initialValues: {
      ...deal,
    },
    validationSchema,
    onSubmit,
  });

  const create = async () => {
    try {
      const input = pick(
        formik.values,
        "description",
        "cr",
        "sf",
        "deal_service_rate"
      );
      const { data } = await createDeal({
        variables: {
          reseller_org_id:
            formik.values && formik.values.reseller_org_id
              ? formik.values.reseller_org_id
              : null,
          input,
        },
      });
      if (data.CreateDeal) {
        navigate(`/settings/deals`);
        return;
      }
      console.error("unexpected return value from server", data);
    } catch (e) {
      console.error(e);
    }
  };

  const save = async () => {
    try {
      const input = pick(
        formik.values,
        "description",
        "cr",
        "sf",
        "deal_service_rate"
      );
      const { data } = await updateDeal({
        variables: {
          id: deal.id,
          input,
        },
      });
      if (data.UpdateDeal) {
        navigate(`/settings/deals`);
        return;
      }
      console.error("unexpected return value from server", data);
    } catch (e) {
      console.error(e);
    }
  };

  function onSubmit() {
    if (deal && deal.id) {
      save();
      return;
    }
    create();
  }

  const handleBackToDeals = () => navigate("/settings/deals");

  const isSuperUser = suFromJWT();

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <div>
          <InputField
            name="description"
            className="mb-4 col-span-6 py-4"
            formik={formik}
            onBlur={false}
            disabled={updating || creating}
            placeholder={f(messages.dealDesc)}
            label={f(messages.dealDesc)}
            cornerHint={f(
              { id: "{count} characters remaining" },
              {
                count: 70 - formik.values.description.length,
                b: (...chunks) => <b key="ttt">{chunks}</b>,
              }
            )}
          />
          <div className="flex">
            <InsetInputField
              name="cr"
              className="mb-4 col-span-6 py-4 md:mr-4"
              icon={<CashIcon className="h-5 w-5 text-gray-400" />}
              formik={formik}
              placeholder={"e.g. 10 %"}
              percent
              number
              disabled={updating || creating}
              label={f(messages.cr)}
            />
            <InsetInputField
              name="sf"
              className="mb-4 col-span-6 py-4"
              icon={<CashIcon className="h-5 w-5 text-gray-400" />}
              formik={formik}
              placeholder={"e.g. EUR 1,49"}
              number
              currency="€"
              disabled={updating || creating}
              label={f(messages.sf)}
            />
          </div>
          {isSuperUser ? (
            <InsetInputField
              name="service_tax_rate"
              className="mb-4 col-span-6 py-4"
              icon={<CashIcon className="h-5 w-5 text-gray-400" />}
              formik={formik}
              placeholder={"e.g. 10 %"}
              number
              disabled={updating || creating}
              label={f(messages.dealServiceTaxRate)}
            />
          ) : null}
          <InputField
            name="reseller_org_id"
            className="mb-4 col-span-6 py-4"
            formik={formik}
            onBlur={false}
            disabled={updating || creating}
            label={f(messages.dealPartnerName)}
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
            {f(messages[deal && deal.id ? "save" : "create"])}
          </LoadingBtn>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleBackToDeals}
          >
            {f(messages.cancel)}
          </button>
        </div>
      </div>
    </form>
  );
}
