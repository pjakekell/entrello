import React from "react";
import { IOrder, IPayItem } from "./interfaces";
import classNames from "classnames";
import Currency from "../Currency";
import { useIntl } from "react-intl";
import { PAYMENT_METHOD_CASH, PAYMENT_METHOD_TERM_CARD } from "../Orders/logic";

import messages from "../../i18n/messages";
import LoadingIcon from "../Btn/LoadingIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSackDollar, faCreditCard } from "@fortawesome/pro-regular-svg-icons";

interface IPaymentMethodTextIconParams {
  method: number;
}

const PaymentMethodTextIcon = ({ method }: IPaymentMethodTextIconParams) => {
  const { formatMessage: f } = useIntl();
  return (
    <div>
      {method === PAYMENT_METHOD_CASH ? (
        <div className="flex center-items">
          <FontAwesomeIcon icon={faSackDollar} className="w-3 h-3" />
          <div className="uppercase ml-1">{f(messages.cash)}</div>
        </div>
      ) : null}
      {method === PAYMENT_METHOD_TERM_CARD ? (
        <div className="flex center-items">
          <FontAwesomeIcon icon={faCreditCard} className="w-3 h-3" />
          <div className="uppercase ml-1">{f(messages.debitcredit)}</div>
        </div>
      ) : null}
    </div>
  );
};

interface IPayItemParams {
  item: IPayItem;
}

const PayItem = ({ item }: IPayItemParams) => {
  const { formatDate: d } = useIntl();
  return (
    <div className={classNames(TABLE_MAPS.TR)}>
      <div className={classNames(TABLE_MAPS.DESC)}>
        <PaymentMethodTextIcon method={item.payment_method} />
      </div>
      <div className={classNames(TABLE_MAPS.QTY)}>
        {item.paid_at ? d(item.paid_at) : null}
      </div>
      <div className={classNames(TABLE_MAPS.VALUE)}>
        <Currency value={item.total} />
      </div>
    </div>
  );
};

const TABLE_MAPS = {
  TR: "pt flex items-center mx-4",
  DESC: "flex-grow pr-2 py-2",
  QTY: "w-12 pr-2 py-2 ml-4 mr-4 text-right",
  VALUE: "w-12 py-2 text-right",
};

const PayItemHeader = () => {
  const { formatMessage: f } = useIntl();
  return (
    <div
      className={classNames(
        TABLE_MAPS.TR,
        "text-gray-400 text-2xs uppercase border-b border-gray-300"
      )}
    >
      <div className={classNames(TABLE_MAPS.DESC)}>
        {f(messages.paymentMethod)}
      </div>
      <div className={classNames(TABLE_MAPS.QTY)}>{f(messages.status)}</div>
      <div className={classNames(TABLE_MAPS.VALUE)}>EUR</div>
    </div>
  );
};

interface IPayItemFooterParams {
  amount: number;
  diff?: boolean;
  total?: boolean;
}

const PayItemFooter = ({ amount, diff, total }: IPayItemFooterParams) => {
  const { formatMessage: f } = useIntl();
  return (
    <div
      className={classNames(
        TABLE_MAPS.TR,
        "border-t border-gray-500",
        diff ? "text-red-600 font-bold" : null,
        !total && !diff ? "text-black font-bold" : null
      )}
    >
      <div className={classNames(TABLE_MAPS.DESC, "uppercase text-2xs")}>
        <div className="pr-4">
          {diff ? f(messages.unpaid) : null}
          {total ? f(messages.total) : null}
          {!diff && !total ? f(messages.subtotal) : null}
        </div>
      </div>
      <div className={classNames(TABLE_MAPS.QTY)}></div>
      <div className={classNames(TABLE_MAPS.VALUE)}>
        <Currency value={amount} />
      </div>
    </div>
  );
};

interface IPayItemsListingParams {
  order: IOrder;
}

export default function PayItemsListing({ order }: IPayItemsListingParams) {
  const { formatMessage: f } = useIntl();

  if (!order.pay_items)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingIcon color="text-indigo-400" />
      </div>
    );

  const amount = order.pay_items.reduce((acc, i) => acc + i.total, 0);
  const diff = order.total - amount;

  return (
    <div className="my-4 mx-2 text-xs border-2 rounded border-green-600">
      <div className="m-4 flex justify-between">
        <div className="w-32 text-green-600 uppercase">
          {f(messages.paidPositions)}
        </div>
      </div>
      <div className="text-xs flex flex-grow items-center my-2">
        <div className="flex-grow">
          <PayItemHeader />
          {order.pay_items.map((item: IPayItem, i: number) => (
            <PayItem item={item} key={`grouped-item-${i}`} />
          ))}
          <PayItemFooter amount={amount} />
          {diff > 0 ? <PayItemFooter amount={diff} diff /> : null}
          {diff > 0 ? <PayItemFooter amount={order.total} total /> : null}
        </div>
      </div>
    </div>
  );
}
