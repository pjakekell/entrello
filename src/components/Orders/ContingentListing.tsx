import React from "react";
import isEmpty from "lodash/isEmpty";
import truncate from "lodash/truncate";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IOrder } from "../Orders/interfaces";
// @ts-ignore
import { Dialog } from "@headlessui/react";

import { useQuery } from "@apollo/react-hooks";
import { FETCH_CONTINGENTS_BY_EVENT_ID } from "./logic";
import { setCurOrder } from "../../store/modules/orders/actions";

import messages from "../../i18n/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "../Tooltip/Tooltip";

interface IContingentItemParams {
  order: IOrder;
}

interface IStatusBadgeParams {
  status_code: number;
}

const StatusBadge = ({ status_code }: IStatusBadgeParams) => {
  const { formatMessage: f } = useIntl();
  switch (status_code) {
    case (0b1 << 1) | status_code:
      return (
        <Tooltip content={f(messages.refunded)}>
          <FontAwesomeIcon icon="list" />
        </Tooltip>
      );
    default:
      return (
        <Tooltip content={f(messages.unpaid)}>
          <FontAwesomeIcon icon="dollar-sign" />
        </Tooltip>
      );
  }
};

const ContingentItem = ({ order }: IContingentItemParams) => {
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const hasOwnName =
    order.contact && (order.contact.firstname || order.contact.lastname);
  let name = order.annotation;
  if (hasOwnName)
    name = `${order.contact.firstname}${
      order.contact.firstname && order.contact.lastname ? " " : ""
    }${order.contact.lastname}`;
  const qty = order.qty;

  const handleClick = () => dispatch(setCurOrder(order.id));

  return (
    <div
      className="border border-gray-300 m-4 p-4 rounded"
      onClick={handleClick}
    >
      <div>
        <div className="title">
          {order.contact.company && order.contact.company.name
            ? order.contact.company.name
            : name}
        </div>
        <div className="desc">
          <span className="text-muted">{order.booking_code}</span>
          {` `}
          {hasOwnName && !isEmpty(order.annotation)
            ? truncate(order.annotation, { length: 25 })
            : null}
        </div>
      </div>
      <div className="status">
        <Tooltip content={f(messages.tickets)}>
          <span>{qty} Tickets</span>
        </Tooltip>
        <StatusBadge status_code={order.status_code} />
      </div>
    </div>
  );
};

export default function ContingentListing() {
  const { id }: any = useParams();
  const { loading, data } = useQuery(FETCH_CONTINGENTS_BY_EVENT_ID, {
    variables: { event_id: id },
  });
  const { formatMessage: f } = useIntl();
  const qtyTotal =
    data && data.orders
      ? data.orders.reduce((acc: number, o: IOrder) => acc + o.qty, 0)
      : 0;
  return (
    <div>
      <div className="px-4 sm:px-6">
        <Dialog.Title className="text-lg font-medium text-gray-900">
          {f(messages.contingents)}
        </Dialog.Title>
      </div>
      <div className="mt-6 relative flex-1 px-4 sm:px-6">
        <div className="ml-auto d-flex align-items-center text-right">
          <div className="mr-1">
            <Tooltip content={<span>{f(messages.tickets)}</span>}>
              <span>{qtyTotal}</span>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="order-list">
        {!loading &&
          data &&
          data.orders.map((order: IOrder) => (
            <ContingentItem order={order} key={`ord_${order.id}`} />
          ))}
      </div>
    </div>
  );
}
