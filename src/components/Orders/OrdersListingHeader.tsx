import React, { useState, useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { NavLink, useParams } from "react-router-dom";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import capitalize from "lodash/capitalize";

import OrderMoreFilters from "./OrderMoreFilters";

import messages from "../../i18n/messages.js";
import {
  ORDER_STATUS_PAID,
  ORDER_STATUS_INVOICED,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_FULLY_REFUNDED,
  ORDER_TYPE_OPTION_OR_RESERVATION,
} from "./logic";
import ExportButton from "../Btn/ExportButton";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_EVENT_BY_ID } from "../Event/logic";
import FormatDateTime from "../common/FormatDateTime";
import { PAGINATION_LIMIT } from "./logic";

interface IOrdersListingHeaderParams {
  refetch: any;
  initLimitOffset: any;
}

const FilterItemParams = [
  { status_code: undefined, order_type: undefined, label: messages.all },
  {
    status_code: ORDER_STATUS_PAID,
    order_type: undefined,
    label: messages.paid,
  },
  {
    status_code: ORDER_STATUS_INVOICED,
    order_type: undefined,
    label: messages.unpaid,
  },
  {
    status_code: undefined,
    order_type: ORDER_TYPE_OPTION_OR_RESERVATION,
    label: messages.reservations,
  },
  {
    status_code: ORDER_STATUS_PENDING,
    order_type: undefined,
    label: messages.pending,
  },
  {
    status_code: ORDER_STATUS_FULLY_REFUNDED,
    order_type: undefined,
    label: messages.refunded,
  },
];

const FilterItem = ({
  status_code,
  firstItem,
  order_type,
  children,
  refetch,
  index,
  isSelected,
  setSelectedIndex,
  initLimitOffset
}: {
  status_code?: number;
  order_type?: string;
  firstItem: boolean;
  children: any;
  refetch: any;
  index: number;
  isSelected: boolean;
  setSelectedIndex: any;
  initLimitOffset: any;
}) => {
  const handleClick = useCallback(() => {
    refetch({
      status_code,
      order_type,
      limit: PAGINATION_LIMIT,
      offset: 0
    });
    initLimitOffset();
    setSelectedIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status_code, order_type, index, refetch, setSelectedIndex]);

  return (
    <div
      className={`text-sm px-4 cursor-pointer ${firstItem ? "pl-0" : ""} ${
        isSelected ? "font-bold text-red-500" : "text-gray-400"
      }`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default function OrdersListingHeader({
  refetch,
  initLimitOffset
}: IOrdersListingHeaderParams) {
  const { formatMessage: f } = useIntl();
  const { eventId } = useParams();
  const { data } = useQuery(FETCH_EVENT_BY_ID, {
    variables: { id: eventId },
  });
  const event = data && data.event ? data.event : null;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const location = useLocation();
  const event_sync_id = useMemo(() => {
    const params = location.pathname.split("/");
    if (params[params.length - 1].includes("event_"))
      return params[params.length - 1];
    else return "";
  }, [location]);

  return (
    <div className="p-2 pt-6">
      <div className="flex items-center">
        <h2
          className={`text-xl text-gray-900 sm:text-${
            event ? "xl" : "2xl"
          } sm:truncate`}
        >
          <div className="leading-2f font-normal">{f(messages.orders)}</div>
          {event ? (
            <div className="font-bold text-sm leading-3 sm:truncate">
              {event.title} -{" "}
              <FormatDateTime
                date={event.starts_at}
                timeZone={"Europe/Vienna"}
              />
            </div>
          ) : null}
        </h2>
        <OrderMoreFilters refetch={refetch} />
        <ExportButton
          event_sync_id={event_sync_id}
          status_code={FilterItemParams[selectedIndex]?.status_code}
          order_type={FilterItemParams[selectedIndex]?.order_type}
        />
        {eventId ? (
          <NavLink to="/orders/new" className="flex-0">
            <button
              type="button"
              className="inline-flex items-center justify-center sm:justify-start text-center sm:text-left px-2 sm:px-4 sm:py-1.5 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="sm:mr-2 h-4 w-4"
                aria-hidden="true"
              />
              <span className="uppercase hidden sm:inline">
                {f(messages.newOrder)}
              </span>
            </button>
          </NavLink>
        ) : null}
      </div>
      <div className="mt-5 flex border-b border-gray-400 pb-1">
        {FilterItemParams.map((item, index) => (
          <FilterItem
            key={`filter-item-${index}`}
            status_code={item.status_code}
            order_type={item.order_type}
            firstItem={index === 0}
            index={index}
            isSelected={selectedIndex === index}
            setSelectedIndex={setSelectedIndex}
            refetch={refetch}
            initLimitOffset={initLimitOffset}
          >
            {capitalize(f(item.label))}
          </FilterItem>
        ))}
      </div>
    </div>
  );
}
