import React, { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { FormikProps, useFormik } from "formik";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";

import LoadingBtn from "../Btn/LoadingBtn";
import CountInputField from "../FormHelpers/CountInputField";
import Error from "../Error";
import Currency from "../Currency";
import CheckboxField from "../FormHelpers/CheckboxField";

import { classNames } from "../../utils/misc";
import messages from "../../i18n/messages";
import { CREATE_ORDER, CREATE_SPLIT_ORDER, SPLIT_ORDER } from "../Orders/logic";
import { IOrder } from "../Orders/interfaces";
import { useOrderSplit } from "../../hooks/useOrderSplit";

type PriceObj = {
  [key: string]: any;
  value: number;
};

interface INonSplOrderForm {
  eventId: string;
  prices: Array<PriceObj>;
  type: string;
  order?: IOrder;
  handleClose: () => void;
}

interface IPriceItem {
  className?: string;
  formik: FormikProps<any>;
  price: any;
  type: string;
  maxQty?: number;
  childrenQtySum?: number;
}

const PriceItem = ({ className, formik, price, type, maxQty }: IPriceItem) => {
  const changeCheckbox = (name: string, value: boolean) => {
    if(!value) {
      formik.setFieldValue(name, 0);
    }
    formik.setFieldValue(`${name}-selected`, value);
  }

  return (
    <div
      className={classNames(
        "flex items-center p-1 border-solid border-slate-200",
        className
      )}
    >
      {
        type === SPLIT_ORDER &&
        <CheckboxField
          formik={formik}
          name={`${price.id}-selected`}
          label=""
          onChange={(value: boolean) => changeCheckbox(price.id, value)}
        />
      }
      <p className="text-sm font-normal text-gray-600 mr-4">
        {price.name || ""}
      </p>
      <div className="flex items-center ml-auto w-52 justify-end">
        <p className="text-sm font-normal text-gray-600 mr-4">
          <Currency value={price.value} />
        </p>
        <CountInputField
          formik={formik}
          name={price.id}
          max={maxQty}
        />
      </div>
    </div>
  );
};

export default function NonSplOrderForm({
  eventId,
  prices,
  type,
  order,
  handleClose,
}: INonSplOrderForm) {
  const { formatMessage: f } = useIntl();
  const [createOrder, { error, loading: creating }] = useMutation(CREATE_ORDER);
  const [createSplitOrder] = useMutation(CREATE_SPLIT_ORDER);
  const navigate = useNavigate();
  const [childrenOrder] = useOrderSplit(order?.split_order_id);
  const maxQtys = useMemo(() => {
    return order ? order.grouped_items.map(item => item.qty) : [];
  }, [order]);
  const totalMaxQty = useMemo(() => {
    return maxQtys.reduce((total, qty) => total += qty, 0);
  }, [maxQtys]);

  const childrenQtySum: number = useMemo(() => {
    if(type !== SPLIT_ORDER || !childrenOrder) return 0;
    return childrenOrder.order_items.reduce((sum: number, item: any) => sum + item.qty, 0);
  }, [childrenOrder, type]);

  const onSubmit = async () => {
    const items: any = [];
    Object.keys(formik.values).forEach((key: any) => {
      const qty = parseInt(formik.values[key as keyof typeof formik.values]);
      if(qty > 0) {
        items.push({
          event_id: eventId,
          qty,
          price_id: key,
        });
      }
    });
    let res: any = null;
    if(type === SPLIT_ORDER) {
      res = await createSplitOrder({
        variables: { split_order_id: order?.id, items }
      });
    }
    else {
      res = await createOrder({
        variables: { items }
      });
    }

    if (res && res.data && res.data.CreateOrder) {
      navigate(`/orders/o/${res.data.CreateOrder.id}`);
    }
  };

  const formik = useFormik({
    initialValues: {},
    onSubmit,
  });

  const remainedQty = useMemo(() => {
    const curEditedQty = 
      prices?.length
      ? prices.reduce((total, price) => total += parseInt(formik.values[price.id as keyof typeof formik.values]) || 0, 0)
      : 0;
    return totalMaxQty - curEditedQty;
  }, [totalMaxQty, formik, prices]);

  const totals: { price: number; qty: number } = useMemo(() => {
    const totals = { price: 0, qty: 0 };
    return Object.keys(formik.values).reduce((totals: any, key: any) => {
      const price = prices.find((item: any) => item.id === key);
      const value = formik.values[key as keyof typeof formik.values];
      totals.qty += parseInt(value) || 0;
      totals.price += (parseInt(formik.values[key as keyof typeof formik.values]) || 0) * (price?.value || 0);
      return totals;
    }, totals);
  }, [formik, prices]);

  useEffect(() => {
    const price: any = {};
    if (!prices) return price;
    prices.forEach((item: any) => {
      formik.setFieldValue(`${item.id}`, 0);
      formik.setFieldValue(`${item.id}-selected`, false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices]);

  if (error) return <Error error={error} />;

  const getPriceMaxQty = (index: number, price: any) => {
    const priceQty = parseInt(formik.values[price.id as keyof typeof formik.values] || 0);
    if(index < maxQtys.length) {
      if(remainedQty < maxQtys[index]) {
        if(remainedQty >= 0)
          return priceQty + remainedQty;
        else
          return priceQty;
      }
      else
        return maxQtys[index];
    }
    else {
      if(remainedQty >= 0)
        return priceQty + remainedQty;
      else
        return priceQty;
    }
  }
  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <div className="mt-5 sm:mt-4 border border-solid border-slate-200">
          {prices &&
            prices.map((price, index) => (
              <PriceItem
                key={`price-item-${index}`}
                className={index === prices.length - 1 ? "" : "border-b"}
                formik={formik}
                price={price}
                type={type}
                maxQty={getPriceMaxQty(index, price)}
                childrenQtySum={childrenQtySum}
              />
            ))}
        </div>
        <div
          className="mt-3 pr-0.5 flex text-sm items-center justify-end p-1"
        >
          <div className="pr-6 font-bold text-slate-700">
            {f(messages.total)}
          </div>
          <div className="font-bold text-slate-700 text-right mr-3 ml-auto">
            <Currency value={totals.price} />
          </div>
          <div className="w-32 mx-5 text-center truncate font-bold text-slate-700">
            {totals.qty}
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex">
          <button
            type="submit"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm"
            onClick={handleClose}
          >
            {f(messages.cancel)}
          </button>
          <LoadingBtn
            loading={creating}
            type="submit"
            className={classNames(
              "focus:outline-none focus:ring-2 focus:ring-offset-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
              !formik.dirty || !formik.isValid || creating
                ? "bg-gray-200 hover:bg-gray-700 focus:ring-gray-500"
                : "bg-brand-500 hover:bg-brand-700 focus:ring-brand-500"
            )}
            disabled={!formik.dirty || !formik.isValid || creating}
          >
            {f(messages.createOrder)}
          </LoadingBtn>
        </div>
      </div>
    </form>
  );
}
