import React, { useState, useRef, useEffect } from "react";
import { IOrder, IPayItem } from "./interfaces";
import { useIntl } from "react-intl";
import { useOrg } from "../../hooks/useOrg";
import { useFormik } from "formik";
import { useMutation } from "@apollo/react-hooks";
import * as Yup from "yup";
import {
  FETCH_ORDER_BY_ID,
  CREATE_PAY_ITEM,
  DELETE_PAY_ITEM,
  PAYMENT_METHOD_TERM_CARD,
  PAYMENT_METHOD_CASH,
  PAYMENT_METHOD_VOUCHER,
} from "./logic";
import { classNames } from "../../utils/misc";

import messages from "../../i18n/messages";
import Currency from "../Currency";
import { TrashIcon, PlusIcon } from "@heroicons/react/outline";
import CurrencyField from "../CurrencyInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill1Wave,
  faCreditCard,
  faGiftCard,
} from "@fortawesome/pro-regular-svg-icons";
import Btn from "../Btn/Btn";

interface IPaymentMethods {
  order: IOrder;
  getDiff: any;
  handleClose: any;
}

interface IPaymentMethodLine {
  payItem: IPayItem;
  order: IOrder;
  diff: number;
  handleClose: any;
}

interface IPaymentMethodBadge {
  name: string;
  children: React.ReactNode;
  onChange: any;
  active: boolean;
}

const PaymentMethodBadge = ({
  children,
  name,
  active,
  onChange,
}: IPaymentMethodBadge) => {
  const handleChange = () => onChange(name);
  return (
    <div
      onClick={handleChange}
      className={classNames(
        "border-2 text-xs border-gray-300 hover:border-gray-500 hover:bg-gray-100 flex items-center justify-center py-1 px-3 rounded uppercase ml-1 cursor-pointer",
        active
          ? "border-indigo-500 bg-indigo-400 text-white hover:bg-indigo-300"
          : "text-gray-400 hover:text-gray-600"
      )}
    >
      {children}
    </div>
  );
};

const PaymentMethodLine = ({
  order,
  payItem,
  diff,
  handleClose,
}: IPaymentMethodLine) => {
  const { formatMessage: f } = useIntl();
  const [editAmount, setEditAmount] = useState(false);
  const [org] = useOrg();
  const currencyFieldRef = useRef<HTMLInputElement>(null);

  const validationSchema = Yup.object().shape({
    total: Yup.number()
      .max(order.total, f(messages.amountHigherThanTotal))
      .required(f(messages.priceRequired)),
  });
  const formik = useFormik({
    initialValues: {
      total: payItem.total,
      paymentMethod: payItem.payment_method,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: handlePay,
  });
  const [createPayItem] = useMutation(CREATE_PAY_ITEM);
  const [deletePayItem] = useMutation(DELETE_PAY_ITEM, {
    refetchQueries: [{ query: FETCH_ORDER_BY_ID, variables: { id: order.id } }],
  });

  useEffect(() => {
    if (
      editAmount &&
      currencyFieldRef &&
      currencyFieldRef.current &&
      currencyFieldRef.current.select
    )
      currencyFieldRef.current.select();
  }, [editAmount]);

  async function handlePay() {
    try {
      await createPayItem({
        variables: {
          input: {
            paid: true,
            order_id: order.id,
            total: formik.values.total,
            payment_method: formik.values.paymentMethod,
          },
        },
        refetchQueries: [
          {
            query: FETCH_ORDER_BY_ID,
            variables: { id: order.id },
          },
        ],
      });
      setEditAmount(false);
      if (diff === 0) handleClose();
    } catch (e) {
      console.error(e);
    }
  }

  const handleChangePayItemType = (methodName: number) => {
    formik.setFieldValue("paymentMethod", methodName);
  };

  const handleDeletePayItem = async () => {
    if (!payItem.id) return;

    try {
      await deletePayItem({
        variables: { id: payItem.id },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleEditCurrency = () => {
    setEditAmount(true);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="border border-gray-200 bg-gray-100 p-1 rounded text-sm flex items-center">
        {org.accepted_payment_methods & PAYMENT_METHOD_CASH ? (
          <PaymentMethodBadge
            onChange={() => handleChangePayItemType(PAYMENT_METHOD_CASH)}
            name="cash"
            active={formik.values.paymentMethod === PAYMENT_METHOD_CASH}
          >
            <FontAwesomeIcon icon={faMoneyBill1Wave} className="w-3 h-3 mr-2" />
            <div className="text-2xs leading-4">{f(messages.cash)}</div>
          </PaymentMethodBadge>
        ) : null}
        <PaymentMethodBadge
          onChange={() => handleChangePayItemType(PAYMENT_METHOD_TERM_CARD)}
          active={formik.values.paymentMethod === PAYMENT_METHOD_TERM_CARD}
          name="term_card"
        >
          <FontAwesomeIcon icon={faCreditCard} className="w-3 h-3 mr-2" />
          <div className="text-2xs leading-4">{f(messages.card)}</div>
        </PaymentMethodBadge>
        <PaymentMethodBadge
          onChange={() => handleChangePayItemType(PAYMENT_METHOD_VOUCHER)}
          active={formik.values.paymentMethod === PAYMENT_METHOD_VOUCHER}
          name="voucher"
        >
          <FontAwesomeIcon icon={faGiftCard} className="w-3 h-3 mr-2" />
          <div className="text-2xs leading-4">{f(messages.voucher)}</div>
        </PaymentMethodBadge>
        <div className="text-indigo-600 flex items-center ml-auto">
          <div className="font-bold">
            <CurrencyField
              formik={formik}
              name="total"
              className={classNames(
                "outline-none border-transparent focus:border-transparent focus:ring-transparent bg-transparent text-right w-32",
                editAmount ? "inline-block" : "hidden"
              )}
              inputRef={currencyFieldRef}
            />
            <Currency
              value={formik.values.total}
              className={classNames(
                editAmount ? "hidden" : "inline-block",
                formik.errors.total ? "text-red-500" : "text-indigo-600"
              )}
              onClick={handleToggleEditCurrency}
            />
          </div>
        </div>
        <div className="ml-4 p-2 rounded">
          {payItem.id ? (
            <TrashIcon
              className="w-4 h-4 text-indigo-300 cursor-pointer"
              onClick={handleDeletePayItem}
            />
          ) : (
            <Btn sm type="submit">
              {f(messages.pay)}
            </Btn>
          )}
        </div>
      </div>
      {formik.errors && formik.errors.total ? (
        <div className="text-red-500 px-2 my-4">{formik.errors.total}</div>
      ) : null}
    </form>
  );
};

const PaymentMethods = ({ order, getDiff, handleClose }: IPaymentMethods) => {
  const diff = getDiff();

  const defaultPayItem = (payment_method: number): IPayItem => {
    return {
      id: null,
      total: diff,
      paid_at: new Date(),
      payment_method,
    };
  };

  const { formatMessage: f } = useIntl();
  const [unsavedPayItem, setUnsavedPayItem] = useState(
    order.pay_items.length < 1 ? defaultPayItem(PAYMENT_METHOD_CASH) : null
  );

  const handleAddPaymentMethod = () => {
    if (order.pay_items.length < 1) return;
    if (diff <= 0) return;

    setUnsavedPayItem(defaultPayItem(PAYMENT_METHOD_TERM_CARD));
  };

  return (
    <div>
      <div className="p-2 border-b-1 border-gray-200 mb-4">
        <div className="uppercase text-sm text-gray-500 flex items-center">
          <div>{f(messages.paymentMethod)}</div>
          <div
            className="border-2 group border-gray-400 cursor-pointer hover:border-brand-500 p-1 ml-auto rounded"
            onClick={handleAddPaymentMethod}
          >
            <PlusIcon className="w-4 h-4 text-gray-400 group-hover:text-brand-500" />
          </div>
        </div>
      </div>
      {order.pay_items.map((payItem: IPayItem) => (
        <PaymentMethodLine
          order={order}
          payItem={payItem}
          handleClose={handleClose}
          diff={diff}
        />
      ))}
      {unsavedPayItem &&
      !order.pay_items.find(
        (pi: IPayItem) => pi.payment_method === unsavedPayItem.payment_method
      ) ? (
        <PaymentMethodLine
          order={order}
          payItem={unsavedPayItem}
          diff={diff}
          handleClose={handleClose}
        />
      ) : null}
    </div>
  );
};

export default PaymentMethods;
