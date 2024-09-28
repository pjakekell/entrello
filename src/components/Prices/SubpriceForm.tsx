import React from "react";
import { useIntl } from "react-intl";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_PRICE, FETCH_PRICES_BY_EVENT_ID, FETCH_PRICES_BY_PARENT_ID, UPDATE_PRICE } from "./logic";
import { useFormik } from "formik";
import { IPrice } from "./interfaces";
import * as Yup from "yup";
import InputField from "../FormHelpers/InputField";
import LoadingBtn from "../Btn/LoadingBtn";
import { CashIcon, CheckIcon, XIcon } from "@heroicons/react/outline";
import { classNames } from "../../utils/misc";
import InsetInputField from "../FormHelpers/InsetInputField";

import messages from "../../i18n/messages";
import { pick } from "lodash";
import { useParams } from "react-router";
import { GET_EVENT_DEALS } from "../../hooks/useEventDeals";
interface ISubpriceForm {
  price: IPrice;
  handleClose: () => void;
}
export default function SubpriceForm({ price, handleClose }: ISubpriceForm) {
  const { formatMessage: f } = useIntl();
  const [createPrice, { loading: creating }] = useMutation(CREATE_PRICE);
  const [updatePrice, { loading: updating }] = useMutation(UPDATE_PRICE);
  const { id: eventId } = useParams();
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
            variables: { event_id: eventId }
          },
          {
            query: FETCH_PRICES_BY_PARENT_ID,
            variables: { parent_id: price.parent_id },
          },
          {
            query: GET_EVENT_DEALS,
            variables: { event_id: eventId },
          }
        ],
      });
      if (data.CreatePrice) {
        handleClose();
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
        refetchQueries: [
          {
            query: FETCH_PRICES_BY_EVENT_ID,
            variables: { event_id: eventId }
          },
          {
            query: FETCH_PRICES_BY_PARENT_ID,
            variables: { parent_id: price.parent_id },
          },
          {
            query: GET_EVENT_DEALS,
            variables: { event_id: eventId },
          }
        ],
      });
      if (data.UpdatePrice) {
        handleClose();
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

  return (
    <tr>
      <td>
        <InputField
          name="name"
          autoFocus
          className="mb-4 col-span-6 py-4"
          formik={formik}
          onBlur={false}
          disabled={updating || creating}
          label={f(messages.name)}
        />
      </td>
      <td>
        <InsetInputField
          name="value"
          className="mb-4 col-span-6 py-4"
          icon={<CashIcon className="h-5 w-5 text-gray-400" />}
          formik={formik}
          number
          currency="€"
          disabled={updating || creating}
          label={f(messages.value)}
        />
      </td>
      <td>
        <div className="w-full flex justify-end">
          <div className="mt-2 sm:flex border border-gray-300 rounded-md">
            <LoadingBtn
              loading={updating || creating}
              onClick={onSubmit}
              type="button"
              color="none"
              className={classNames(
                "rounded-tl-md rounded-bl-md bg-none",
                !formik.dirty || !formik.isValid || updating || creating
                  ? "text-gray-400 hover:text-gray-500 focus:ring-gray-500 cursor-default"
                  : "text-brand-500 hover:text-brand-700 focus:ring-brand-500"
              )}
              disabled={
                !formik.dirty || !formik.isValid || updating || creating
              }
            >
              <CheckIcon
                className={classNames(
                  "w-6 h-6",
                  !formik.dirty || !formik.isValid || updating || creating
                    ? "text-gray-500"
                    : "text-brand-500"
                )}
              />
            </LoadingBtn>
            <button
              type="submit"
              className="px-3 text-gray-200 rounded-tr-md rounded-br-md"
              onClick={handleClose}
            >
              <XIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}
