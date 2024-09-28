import React, { Fragment, useState, useCallback, useEffect } from "react";
import { useIntl } from "react-intl";
import { Menu, Transition, Disclosure } from "@headlessui/react";
import { FilterIcon } from "@heroicons/react/solid";
import { useFormik } from "formik";
import * as Yup from "yup";

import CheckboxField from "../FormHelpers/CheckboxField";
import OrderFilterDatePanel from "./OrderFilterDatePanel";
import OrderFilterAmountPanel from "./OrderFilterAmountPanel";
import OrderFilterStatusPanel from "./OrderFilterStatusPanel";
import SelectSeason from "../Events/EventsListingHeader/SelectSeason";
import Btn from "../Btn/Btn";

import logger from "../../utils/logger";
import messages from "../../i18n/messages";
import { ORDER_MORE_STATUS, TIMEZONE_GMT, TIMEZONE_UTC } from "./logic";

const dateLimitOptions = [
  { id: 1, name: "is in the last", unavailable: false },
  { id: 2, name: "is equal to", unavailable: false },
  { id: 3, name: "is between", unavailable: false },
  { id: 4, name: "is after", unavailable: true },
  { id: 5, name: "is on or after", unavailable: false },
  { id: 6, name: "is before", unavailable: false },
  { id: 7, name: "is before or on", unavailable: false },
];

const dayLimitOptions = [
  { id: 1, name: "days", unavailable: false },
  { id: 2, name: "months", unavailable: false },
];

const amountOptions = [
  { id: 1, name: "is equal to", unavailable: false },
  { id: 2, name: "is between", unavailable: false },
  { id: 3, name: "is greater than", unavailable: false },
  { id: 4, name: "is less than", unavailable: false },
];

const paymentOptions = [
  { id: 1, name: "Card", unavailable: false },
  { id: 2, name: "ACH Direct Debit", unavailable: false },
  { id: 3, name: "ACH Credit Transfer", unavailable: false },
  { id: 4, name: "Canadian pre-authorized debits", unavailable: false },
  { id: 5, name: "Alipay", unavailable: false },
  { id: 6, name: "Bancontact", unavailable: false },
  { id: 7, name: "BECS Direct Debit (AU)", unavailable: false },
  { id: 8, name: "Card Present", unavailable: false },
  { id: 9, name: "Interac", unavailable: false },
  { id: 10, name: "EPS", unavailable: false },
  { id: 11, name: "giropay", unavailable: false },
  { id: 12, name: "iDEAL", unavailable: false },
  { id: 13, name: "Multibanco", unavailable: false },
  { id: 14, name: "Klarna", unavailable: false },
  { id: 15, name: "P24", unavailable: false },
  { id: 16, name: "SEPA Direct Debit", unavailable: false },
  { id: 17, name: "Sofort", unavailable: false },
  { id: 18, name: "3D Secure", unavailable: false },
  { id: 19, name: "3D Secure 2", unavailable: false },
  { id: 20, name: "Afterpay / Clearpay", unavailable: false },
  { id: 21, name: "WeChat Pay", unavailable: false },
  { id: 22, name: "Link", unavailable: false },
];

interface ICustomMenuButtonParams {
  children: any;
}

interface Values {
  dateLimit: Object;
  dayLimit: Object;
  dayLimitNum: string | number;
  dateStart: Date | null;
  dateEnd: Date | null;
  timeZoneGMT: boolean;
  timeZoneUTC: boolean;
  amount: Object;
  amountNumStart: string | number;
  amountNumEnd: string | number;
  payment: Object;
  succeeded: boolean;
  incomplete: boolean;
  uncaptured: boolean;
  disputed: boolean;
  pending: boolean;
  refunded: boolean;
  refundPending: boolean;
  partialRefunded: boolean;
  failed: boolean;
  canceled: boolean;
  earlyFraudWarning: boolean;
}

interface IOrderMoreFiltersParam {
  refetch: any;
}

export default function OrderMoreFilters({ refetch }: IOrderMoreFiltersParam) {
  const { formatMessage: f } = useIntl();
  const [isMenuOpened, setMenuOpened] = useState(false);

  const CustomMenuButton = function ({ children }: ICustomMenuButtonParams) {
    return (
      <button
        type="button"
        className="inline-flex items-center justify-center sm:justify-start text-center sm:text-left mr-2 sm:py-2 text-sm font-medium text-gray-500"
        onClick={() => setMenuOpened(!isMenuOpened)}
      >
        {children}
      </button>
    );
  };

  const onSubmit = (variables: Values) => {
    try {
      const {
        dateLimit,
        dayLimit,
        dayLimitNum,
        amount,
        amountNumStart,
        amountNumEnd,
        payment,
      } = formik.values;
      const timeZone = formik.values.timeZoneGMT ? TIMEZONE_GMT : TIMEZONE_UTC;
      const status = Object.keys(ORDER_MORE_STATUS).reduce(
        (result: any, curKey: any) => {
          if (formik.values[curKey as keyof typeof formik.values])
            result |= ORDER_MORE_STATUS[curKey];
          else result |= 0;
          return result;
        },
        0
      );

      const params = {
        dateLimit,
        dayLimit,
        dayLimitNum,
        timeZone,
        amount,
        amountNumStart,
        amountNumEnd,
        status,
        payment,
      };
      refetch(params);
    } catch (e) {
      logger.warn("caught", e);
    }
  };

  const validationSchema = Yup.object().shape({
    dateEnd: Yup.date().when(
      "dateStart",
      (dateStart, schema) => dateStart && schema.min(dateStart)
    ),
    amountNumEnd: Yup.number().when(
      "amountNumStart",
      (amountNumStart, schema) => amountNumStart && schema.min(amountNumStart)
    ),
  });

  const formik = useFormik({
    initialValues: {
      dateLimit: dateLimitOptions[0],
      dayLimit: dayLimitOptions[0],
      dayLimitNum: "",
      dateStart: null,
      dateEnd: null,
      timeZoneGMT: true,
      timeZoneUTC: false,
      amount: amountOptions[0],
      amountNumStart: "",
      amountNumEnd: "",
      payment: paymentOptions[0],
      succeeded: false,
      incomplete: false,
      uncaptured: false,
      disputed: false,
      pending: false,
      refunded: false,
      refundPending: false,
      partialRefunded: false,
      failed: false,
      canceled: false,
      earlyFraudWarning: false,
    },
    validationSchema,
    onSubmit,
  });

  const categoryFormik = useFormik({
    initialValues: {
      date: false,
      amount: false,
      status: false,
      paymentMethod: false,
    },
    onSubmit: () => {},
  });

  const hideFilterPanel = useCallback(() => {
    categoryFormik.setFieldValue("date", false);
    categoryFormik.setFieldValue("amount", false);
    categoryFormik.setFieldValue("status", false);
    categoryFormik.setFieldValue("paymentMethod", false);
  }, [categoryFormik]);

  useEffect(() => {
    formik.setFieldValue("dayLimit", dayLimitOptions[0]);
    formik.setFieldValue("dayLimitNum", "");
    formik.setFieldValue("dateStart", null);
    formik.setFieldValue("dateEnd", null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.dateLimit]);

  useEffect(() => {
    formik.setFieldValue("amountNumStart", "");
    formik.setFieldValue("amountNumEnd", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.amount]);

  return (
    <Menu as="div" className="relative inline-block text-left ml-auto">
      <div>
        <Menu.Button as={CustomMenuButton}>
          <FilterIcon className="w-4 h-4" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        show={isMenuOpened}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <form
          className="absolute right-0 w-64 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 focus:outline-none"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex align-center justify-between border-b border-solid border-inherit bg-slate-100 py-2 px-4">
            <Btn
              className="mr-0.5 rounded-md hover:bg-opacity-70"
              color="default"
              sm
              onClick={hideFilterPanel}
            >
              {f(messages.clear)}
            </Btn>
            <p className="text-gray-500 text-md">{f(messages.filters)}</p>
            <Btn
              className="mr-0.5 rounded-md hover:bg-opacity-70"
              color="info"
              type="submit"
              sm
            >
              {f(messages.done)}
            </Btn>
          </div>
          <Disclosure>
            <>
              <div className="border-b border-solid border-inherit">
                <Disclosure.Button className="flex mx-4 py-2 text-sm font-medium text-left text-purple-900">
                  <CheckboxField
                    formik={categoryFormik}
                    name="date"
                    value={categoryFormik.values.date}
                    label={f(messages.date)}
                  />
                </Disclosure.Button>
              </div>
              {categoryFormik.values.date && (
                <Disclosure.Panel
                  className="px-2 pt-2 pb-2 text-sm text-gray-500 bg-slate-100"
                  static
                >
                  <OrderFilterDatePanel
                    props={formik}
                    dateLimitOptions={dateLimitOptions}
                    dayLimitOptions={dayLimitOptions}
                    isRequired={categoryFormik.values.date}
                  />
                </Disclosure.Panel>
              )}
            </>
          </Disclosure>
          <Disclosure>
            <>
              <div className="border-b border-solid border-inherit">
                <Disclosure.Button className="flex mx-4 py-2 text-sm font-medium text-left text-purple-900 cursor-auto">
                  <CheckboxField
                    formik={categoryFormik}
                    name="amount"
                    value={categoryFormik.values.amount}
                    label={f(messages.amount)}
                  />
                </Disclosure.Button>
              </div>
              {categoryFormik.values.amount && (
                <Disclosure.Panel
                  className="px-4 pt-4 pb-2 text-sm text-gray-500 bg-slate-100"
                  static
                >
                  <OrderFilterAmountPanel
                    props={formik}
                    amountOptions={amountOptions}
                    isRequired={categoryFormik.values.amount}
                  />
                </Disclosure.Panel>
              )}
            </>
          </Disclosure>
          <Disclosure>
            <>
              <div className="border-b border-solid border-inherit">
                <Disclosure.Button className="flex mx-4 py-2 text-sm font-medium text-left text-purple-900">
                  <CheckboxField
                    formik={categoryFormik}
                    name="status"
                    value={categoryFormik.values.status}
                    label={f(messages.status)}
                  />
                </Disclosure.Button>
              </div>
              {categoryFormik.values.status && (
                <Disclosure.Panel
                  className="px-4 pt-4 pb-2 text-sm text-gray-500 bg-slate-100"
                  static
                >
                  <OrderFilterStatusPanel statusFormik={formik} />
                </Disclosure.Panel>
              )}
            </>
          </Disclosure>
          <Disclosure>
            <>
              <div className="border-b border-solid border-inherit">
                <Disclosure.Button className="flex mx-4 py-2 text-sm font-medium text-left text-purple-900">
                  <CheckboxField
                    formik={categoryFormik}
                    name="paymentMethod"
                    value={categoryFormik.values.paymentMethod}
                    label={f(messages.paymentMethod)}
                  />
                </Disclosure.Button>
              </div>
              {categoryFormik.values.paymentMethod && (
                <Disclosure.Panel
                  className="px-4 pt-4 pb-2 text-sm text-gray-500 bg-slate-100"
                  static
                >
                  <SelectSeason
                    name="payment"
                    options={paymentOptions}
                    value={formik.values.payment}
                    props={formik}
                  />
                </Disclosure.Panel>
              )}
            </>
          </Disclosure>
        </form>
      </Transition>
    </Menu>
  );
}
