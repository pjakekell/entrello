import React from "react";
import { IOrder } from "./interfaces";
import classNames from "classnames";
import Currency from "../Currency";
import { useIntl } from "react-intl";
import OrderStatusBadge from "./OrderStatusBadge";

import messages from "../../i18n/messages";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";

interface ISplitOrdersParams {
  orders: [IOrder];
}

interface ISplitOrderItemParams {
  item: IOrder;
}

const SplitOrder = ({ item }: ISplitOrderItemParams) => {
  const location = useLocation();
  return (
    <div className={classNames(TABLE_MAPS.TR)}>
      <div className={classNames(TABLE_MAPS.DESC)}>
        <Link
          to={`${location.pathname.split("/ord_")[0]}/${item.id}`}
          className="text-brand-500"
        >
          {item.booking_code}
        </Link>
      </div>
      <div className={classNames(TABLE_MAPS.QTY)}>
        <OrderStatusBadge order={item} />
      </div>
      <div className={classNames(TABLE_MAPS.QTY)}>{item.qty}</div>
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

const SplitOrderHeader = () => {
  const { formatMessage: f } = useIntl();
  return (
    <div
      className={classNames(
        TABLE_MAPS.TR,
        "text-gray-400 text-2xs uppercase border-b border-gray-200"
      )}
    >
      <div className={classNames(TABLE_MAPS.DESC)}>
        {f(messages.bookingCode)}
      </div>
      <div className={classNames(TABLE_MAPS.QTY)}>{f(messages.status)}</div>
      <div className={classNames(TABLE_MAPS.QTY)}>{f(messages.qtyAbbr)}</div>
      <div className={classNames(TABLE_MAPS.VALUE)}>EUR</div>
    </div>
  );
};

export default function SplitOrdersListing({ orders }: ISplitOrdersParams) {
  const { formatMessage: f } = useIntl();

  return (
    <div className="py-4 text-xs">
      <div className="ml-6 mr-4 flex justify-between">
        <div className="w-32 text-gray-400 uppercase">
          {f(messages.linkedOrders)}
        </div>
      </div>
      <div className="text-xs flex flex-grow items-center my-4">
        <div className="p-2 border-t border-b border-gray-200 flex-grow">
          <SplitOrderHeader />
          {orders.map((item: IOrder, i: number) => (
            <SplitOrder item={item} key={`grouped-item-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
