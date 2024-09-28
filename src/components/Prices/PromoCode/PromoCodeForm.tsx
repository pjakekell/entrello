import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useIntl } from "react-intl";
import { isUndefined, pick } from "lodash";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Select from "react-select";

import InputField from "../../FormHelpers/InputField";
import LoadingBtn from "../../Btn/LoadingBtn";

import { classNames } from "../../../utils/misc";
import messages from "../../../i18n/messages";
import { CREATE_PROMO_CODE, FETCH_PROMO_CODES, IPromoCode, UPDATE_PROMO_CODE } from "./logic";
import { FETCH_PRICE_NAMES, IPriceName } from "../PriceName/logic";

export default function PromoCodeForm({ handleClose, promoCode }: { handleClose: () => void, promoCode: IPromoCode }) {
  const { formatMessage: f } = useIntl();
  const [createPromoCode, { loading: creating }] = useMutation(CREATE_PROMO_CODE);
  const [updatePromoCode, { loading: updating }] = useMutation(UPDATE_PROMO_CODE);
  const { data } = useQuery(FETCH_PRICE_NAMES);
  const [selectedPriceName, setSelectedPriceName] = useState<IPriceName | null>(null);

  const priceNameOptions = useMemo(() => {
    if(!data) return [];
    return data.price_names.map((item: IPriceName) => ({
      ...item,
      value: item.id,
      label: item.name
    }))
  }, [data]);

  useEffect(() => {
    if(!priceNameOptions?.length) return;
    return priceNameOptions.find((item: any) => item.id === promoCode?.id);
  }, [promoCode, priceNameOptions]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(f(messages.nameRequired)),
    description: Yup.string(),
    code: Yup.string(),
  })

  const formik = useFormik({
    initialValues: {
      ...promoCode,
    },
    validationSchema,
    onSubmit,
  });

  const create = async () => {
    try {
      const input = pick(
        formik.values,
        "name",
        "description",
        "code"
      );
      const { data } = await createPromoCode({
        variables: {
          input: {
            ...input,
            price_name_id: selectedPriceName?.id
          }
        },
        refetchQueries: [
          {
            query: FETCH_PROMO_CODES,
          }
        ],
      });
      if (data.CreatePromoCode) {
        handleClose();
        return;
      }
      console.error("unexpected return value from server", data);
    } catch (e) {
      console.error(e);
    }
  };

  const save = async () => {
    const { id } = promoCode;
    try {
      const input = pick(
        formik.values,
        "name",
        "description"
      );
      const { data } = await updatePromoCode({
        variables: {
          id,
          input
        },
        refetchQueries: [
          {
            query: FETCH_PROMO_CODES,
          }
        ],
      });
      if (data.UpdatePromoCode) {
        handleClose();
        return;
      }
      console.error("unexpected return value from server", data);
    } catch (e) {
      console.error(e);
    }
  };

  function onSubmit() {
    if (promoCode && promoCode.id) {
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
          label={f(messages.promoCode)}
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
        <InputField
          name="code"
          className="mb-2 py-2"
          formik={formik}
          disabled={creating || updating}
          label={f(messages.code)}
          cornerHint={f(
            { id: "{count} characters remaining" },
            {
              count:
                40 -
                (!isUndefined(formik.values.code)
                  ? formik.values.code.length
                  : 0),
              b: (...chunks) => <b key="ttt">{chunks}</b>,
            }
          )}
        />
        <div>
          <label htmlFor="price_name" className="block text-sm font-normal text-gray-700">
            {f(messages.priceName)}
          </label>
          <Select
            options={priceNameOptions}
            className="price_template__menu mt-1"
            value={selectedPriceName}
            components={{
              DropdownIndicator: () => null, IndicatorSeparator: () => null
            }}
            isSearchable={false}
            hideSelectedOptions={true}
            isClearable={false}
            onChange={setSelectedPriceName}
          />        
        </div>
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
          {f(messages[promoCode && promoCode.id ? "save" : "create"])}
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