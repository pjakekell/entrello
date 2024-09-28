import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import {
  InfiniteLoader,
  AutoSizer,
  SortDirection,
  Table,
  Column,
} from "react-virtualized";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { faGiftCard, faTicketAlt } from "@fortawesome/pro-regular-svg-icons";
import { useIntl } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSackDollar, faCreditCard } from "@fortawesome/pro-regular-svg-icons";

import Error from "../Error";
import { ORDER_TYPE_RESERVATION, ORDER_TYPE_OPTION } from "./logic";
import { useOrdersFilter } from "../../hooks/useOrdersFilter";
import OrdersListingHeader from "./OrdersListingHeader";
import { classNames } from "../../utils/misc";
import messages from "../../i18n/messages.js";
import OrderStatusBadge from "./OrderStatusBadge";
import Currency from "../Currency";
import Container from "../Layout/Container";
import { useOrderSubscription } from "../../hooks/useOrderSubscription";
import LoadingData from "../common/LoadingData";
import NoResultsFromQueryYet from "../common/NoResultsFromQueryYet";
import { IOrder } from "./interfaces";
import { PAGINATION_LIMIT } from "./logic";

interface IRowGetter {
  index: number;
}

export default function OrdersListing() {
  const { formatMessage: f, formatDate: d } = useIntl();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(PAGINATION_LIMIT);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { eventId } = useParams();
  useOrderSubscription();
  const event_ids = [];
  if (eventId && eventId.length > 0) {
    event_ids.push(eventId);
  }

  const [filteredOrders, { loading, error, refetch }] = useOrdersFilter({
    event_ids,
    limit,
    offset
  });
  const [orders, setOrders] = useState<Array<IOrder>>([]);

  useEffect(() => {
    if(!filteredOrders) return;
    if(offset)
      setOrders(prev => [...prev, ...filteredOrders]);
    else
      setOrders(filteredOrders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredOrders]);

  if (error) return <Error error={error} />;

  const handleOpenOrder = ({ rowData: order }: any) => {
    navigate(`/orders/o/${order.id}`);
  };

  const sortBy = "booking_code";
  const sortDir = SortDirection.ASC;

  const rowGetter = ({ index }: IRowGetter) => {
    return orders ? orders[index] : {};
  };

  const renderQty = ({ rowData: order }: any) => (
    <div className="flex items-center">
      {order && order.order_type === "VOUCHER" ? (
        <FontAwesomeIcon
          icon={faGiftCard}
          className="w-3 h-3 mr-1 text-indigo-600 group-hover:text-brand-500"
        />
      ) : (
        <FontAwesomeIcon
          icon={faTicketAlt}
          className="w-3 h-3 mr-1 text-gray-400 group-hover:text-brand-500"
        />
      )}
      {order.qty}
    </div>
  );

  const renderTotal = ({ rowData: order }: any) => {
    return (
      <div>
        {order.pay_items && order.pay_items[0].payment_method === 101 ? (
          <FontAwesomeIcon icon={faSackDollar} />
        ) : null}
        {order.pay_items && order.pay_items[0].payment_method === 102 ? (
          <FontAwesomeIcon icon={faCreditCard} />
        ) : null}
        <Currency value={order.total} />
      </div>
    );
  };

  const renderStatus = ({ rowData }: any) => {
    return <OrderStatusBadge order={rowData} />;
  };

  const renderCreatedAt = ({ cellData }: any) => (
    <div className="flex items-center justify-end">
      {d(cellData, {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })}
    </div>
  );

  const renderActionIcon = () => (
    <ChevronRightIcon className="h-8 text-gray-400 self-end" />
  );

  const renderContact = ({ rowData }: any) => {
    const contact = rowData.contact;
    return (
      <div>
        <div>{contact.name}</div>
        <div
          className={classNames(
            "italic",
            contact && contact.name ? "text-2xs" : ""
          )}
        >
          {rowData.annotation}
        </div>
      </div>
    );
  };

  const renderBookingCode = ({ cellData }: any) => {
    let bookingCode = cellData;
    const slashIndex = bookingCode.indexOf('-');
    const dotIndex = bookingCode.indexOf('.');
    if(dotIndex > 0) {
      bookingCode = bookingCode.slice(0, slashIndex + 1) + bookingCode.slice(dotIndex + 1);
    }
    
    return (
      <div>
        <div className="text-bold">{bookingCode}</div>
      </div>
    );
  }

  const renderTitle = ({ cellData }: any) => {
    const cArr = cellData.split(" - ");
    return (
      <div>
        <div className="text-bold">{cArr[0]}</div>
      </div>
    );
  };

  const renderStartsAt = ({ cellData }: any) => {
    const cArr = cellData.split(" - ");
    return (
      <div>
        <div className="text-bold">{cArr[1]}</div>
      </div>
    );
  };

  const calcRowClassName = ({ index }: any) =>
    classNames(
      "flex border-l-4 items-center cursor-pointer hover:bg-blue-50 transition duration-200 ease-in-out text-sm",
      index >= 0 && orders && orders[index] && orders[index].id === orderId
        ? "border-brand-500 border-b-0 bg-blue-100"
        : "text-gray-600 border-l-transparent border-b",
      index >= 0 && orders && orders[index] && orders[index].deleted_at
        ? "bg-red-200 border-red-600 border-b-0"
        : null,
      index >= 0 && orders && orders[index].order_type === "VOUCHER"
        ? "text-indigo-600 font-bold"
        : null,
      index >= 0 &&
        orders &&
        orders[index] &&
        (orders[index].order_type === ORDER_TYPE_RESERVATION ||
          orders[index].order_type === ORDER_TYPE_OPTION)
        ? "text-fuchsia-600 font-bold"
        : null
    );

  const loadMore = (params: any) => {
    return refetch({
      offset,
      limit
    })
      .then((result: any) => {
        if(!result.data?.orders?.length) return;
        setLimit((prev) => prev + result.data.orders.length);
        setOffset((prev) => prev + result.data.orders.length);
      });
  };

  const initLimitOffset = () => {
    setLimit(PAGINATION_LIMIT);
    setOffset(0);
  }

  return (
    <Container>
      <div className="px-2 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto min-h-screen">
        <OrdersListingHeader
          refetch={refetch}
          initLimitOffset={initLimitOffset}
        />
        <InfiniteLoader
          isRowLoaded={() => loading}
          loadMoreRows={loadMore}
          rowCount={orders ? orders.length : 0}
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer>
              {({ height, width }) => (
                <Table
                  ref={registerChild}
                  onRowsRendered={onRowsRendered}
                  height={height}
                  headerHeight={40}
                  className="mb-6"
                  headerClassName="flex px-2 h-full items-center"
                  overscanRowCount={10}
                  noRowsRenderer={() =>
                    loading ? (
                      <LoadingData />
                    ) : (
                      <NoResultsFromQueryYet
                        message={f(messages.noOrdersMatchingQuery)}
                      />
                    )
                  }
                  rowCount={orders ? orders.length : 0}
                  rowHeight={40}
                  onRowClick={handleOpenOrder}
                  width={width}
                  rowClassName={calcRowClassName}
                  rowGetter={rowGetter}
                  sort={({ sortBy, sortDirection }) =>
                    console.log("not impl.", sortBy, sortDirection)
                  }
                  sortBy={sortBy}
                  sortDirection={sortDir}
                >
                  <Column
                    label={f(messages.bookingCode)}
                    dataKey="booking_code"
                    className="px-2"
                    cellRenderer={renderBookingCode}
                    width={200}
                  />
                  <Column
                    label={f(messages.title)}
                    className="px-2"
                    dataKey="title"
                    width={300}
                    cellRenderer={renderTitle}
                    flexGrow={1}
                  />
                  <Column
                    label={f(messages.date)}
                    className="px-2"
                    dataKey="title"
                    width={150}
                    cellRenderer={renderStartsAt}
                    flexGrow={0}
                    flexShrink={0}
                  />
                  <Column
                    dataKey="id"
                    cellRenderer={renderContact}
                    flexGrow={1}
                    label={f(messages.name)}
                    width={300}
                  />
                  <Column
                    label={f(messages.volume)}
                    headerClassName="justify-end"
                    dataKey="total"
                    className="px-2 items-center justify-end text-right"
                    cellRenderer={renderTotal}
                    width={125}
                  />
                  <Column
                    label={f(messages.qtyAbbr)}
                    headerClassName="justify-start"
                    dataKey="qty"
                    className="px-2 items-center"
                    cellRenderer={renderQty}
                    width={85}
                  />
                  <Column
                    label={f(messages.status)}
                    dataKey="status_code"
                    className="px-2 items-center"
                    cellRenderer={renderStatus}
                    flexGrow={1}
                    width={300}
                  />
                  <Column
                    dataKey="created_at"
                    headerClassName="justify-center"
                    className="px-2 justify-end"
                    cellRenderer={renderCreatedAt}
                    label={f(messages.creationDate)}
                    width={220}
                  />
                  <Column
                    dataKey="id"
                    label=""
                    className="flex justify-end pr-2"
                    cellRenderer={renderActionIcon}
                    width={80}
                  />
                </Table>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
        <Outlet />
      </div>
    </Container>
  );
}
