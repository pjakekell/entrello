import React from "react";
import { IOrder } from "./interfaces";
import {
  ORDER_STATUS_CLAIMED,
  ORDER_STATUS_PAID,
  ORDER_STATUS_BOOKED,
  ORDER_STATUS_INVOICED,
  ORDER_STATUS_PENDING,
  ORDER_TYPE_RESERVATION,
  ORDER_TYPE_OPTION,
  ORDER_STATUS_PARTIALLY_REFUNDED,
} from "./logic";
import { useIntl } from "react-intl";

import messages from "../../i18n/messages.js";
import { ClockIcon } from "@heroicons/react/outline";
import StatusBadge from "./StatusBadge";
import { faHandshake } from "@fortawesome/pro-regular-svg-icons/faHandshake";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IOrderStatusBadge {
  order: IOrder;
}

export default function OrderStatusBadge({ order }: IOrderStatusBadge) {
  const status = order.status_code;
  const { formatMessage: f } = useIntl();
  const claimed =
    status & ORDER_STATUS_CLAIMED &&
    status ^ ORDER_STATUS_BOOKED &&
    order.expires_at ? (
      <StatusBadge intent="claim" expires_at={new Date(order.expires_at)} />
    ) : null;
  const invoiced =
    status & ORDER_STATUS_INVOICED && status ^ ORDER_STATUS_PAID ? (
      <StatusBadge intent="invoiced" />
    ) : null;
  const pending =
    status & ORDER_STATUS_PENDING ? (
      <ClockIcon className="w-5 h-5 text-yellow-500 inline-block" />
    ) : null;
  const paid =
    status & ORDER_STATUS_PAID ? <StatusBadge intent="paid" /> : null;
  const refunded =
    status & ORDER_STATUS_PARTIALLY_REFUNDED ? (
      <StatusBadge intent="claim" />
    ) : null;
  let type = (<></>) as any;
  if (order.order_type === ORDER_TYPE_RESERVATION)
    type = (
      <div className="rounded-full bg-fuchsia-600 text-white py-1 px-2 text-xs uppercase leading-none">
        {f(messages.reservation)}
      </div>
    );
  if (order.order_type === ORDER_TYPE_OPTION)
    type = (
      <FontAwesomeIcon
        icon={faHandshake}
        className="w-4 h-4 px-1 text-gray-400"
      />
    );
  return (
    <div className="flex items-center">
      {claimed}
      {invoiced}
      {pending}
      {paid}
      {refunded}
      {type}
    </div>
  );
}
