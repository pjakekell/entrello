import React from "react";
import { useIntl } from "react-intl";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_PRICE, FETCH_PRICES_BY_EVENT_ID, UPDATE_PRICE } from "./logic";
import { useFormik } from "formik";
import { IPrice } from "./interfaces";
import * as Yup from "yup";
import InputField from "../FormHelpers/InputField";
import LoadingBtn from "../Btn/LoadingBtn";
import { useParams } from "react-router-dom";
import { CashIcon } from "@heroicons/react/outline";
import { classNames } from "../../utils/misc";
import InsetInputField from "../FormHelpers/InsetInputField";
import ColorPicker from "../FormHelpers/ColorPicker";

import messages from "../../i18n/messages";
import { useNavigate } from "react-router-dom";
import { pick } from "lodash";
import TaxGroupInput from "../FormHelpers/TaxGroupInput";
import { GET_EVENT_DEALS } from "../../hooks/useEventDeals";

interface IPriceForm {
  price: IPrice;
  handleClose: (id: string | null) => void;
}

export default function PriceForm({ price, handleClose }: IPriceForm) {
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();
  const { id: eventId } = useParams();
  const [createPrice, { loading: creating }] = useMutation(CREATE_PRICE);
  const [updatePrice, { loading: updating }] = useMutation(UPDATE_PRICE);
  const validationSchema = Yup.object().shape({
    name: Yup.string().max(40).required(f(messages.nameRequired)),
    value: Yup.number()
      .min(0)
      .max(15000, f(messages.priceValueLimitContactSales))
      .required(f(messages.priceRequired)),
    tax_group_id: Yup.string().required(),
  });
  const formik = useFormik({
    initialValues: {
      ...price,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });

  const create = async () => {
    try {
      const input = pick(
        formik.values,
        "name",
        "value",
        "tax_group_id",
        "event_id",
        "parent_id",
        "color"
      );
      const { data } = await createPrice({
        variables: {
          input,
        },
        refetchQueries: [
          {
            query: FETCH_PRICES_BY_EVENT_ID,
            variables: { event_id: eventId },
          },
          {
            query: GET_EVENT_DEALS,
            variables: { event_id: eventId },
          },
        ],
      });
      if (data.CreatePrice) {
        handleClose(null);
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
        "name",
        "value",
        "color",
        "tax_group_id",
        "parent_id"
      );
      const { data } = await updatePrice({
        variables: {
          id: price.id,
          input,
        },
      });
      if (data.UpdatePrice) {
        handleClose(null);
        return;
      }
      console.error("unexpected return value from server", data);
    } catch (e) {
      console.error(e);
    }
  };

  function onSubmit() {
    if (price && price.id) {
      save();
      return;
    }
    create();
  }

  const handleBackToPrices = () => navigate(`/events/${eventId}/prices`);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <InputField
          name="name"
          className="mb-2 col-span-6 py-4"
          formik={formik}
          onBlur={false}
          disabled={updating || creating}
          label={f(messages.name)}
          cornerHint={f(
            { id: "{count} characters remaining" },
            {
              count: 40 - formik.values.name.length,
              b: (...chunks) => <b key="ttt">{chunks}</b>,
            }
          )}
        />
        <InsetInputField
          name="value"
          className="mb-2 col-span-6 py-4"
          icon={<CashIcon className="h-5 w-5 text-gray-400" />}
          formik={formik}
          number
          currency="€"
          disabled={updating || creating}
          label={f(messages.value)}
        />
        <ColorPicker
          name="color"
          formik={formik}
          label={f(messages.color)}
          className="mb-2 col-span-6 py-4"
        />
        <TaxGroupInput
          name="tax_group_id"
          className="mb-2 col-span-6 py-4"
          formik={formik}
          label={f(messages.taxGroup)}
        />
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
            {f(messages[price && price.id ? "save" : "create"])}
          </LoadingBtn>
          <button
            type="submit"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleBackToPrices}
          >
            {f(messages.cancel)}
          </button>
        </div>
      </div>
    </form>
  );
}
