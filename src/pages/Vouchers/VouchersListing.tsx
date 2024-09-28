import React, { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { useIntl } from "react-intl";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Currency from "../../components/Currency";
import {
  AutoSizer,
  SortDirection,
  Table,
  Column,
  TableCellRenderer,
} from "react-virtualized";
import { sortBy } from "lodash";

import messages from "../../i18n/messages";
import { useVouchers } from "../../hooks/useVouchers";
import Error from "../../components/Error";
import { IVoucher } from "./interfaces";
import LoadingData from "../../components/common/LoadingData";
import NoResultsFromQueryYet from "../../components/common/NoResultsFromQueryYet";
import { ChevronRightIcon } from "@heroicons/react/outline";
import OrderStatusBadge from "../../components/Orders/OrderStatusBadge";

interface IRowGetter {
  index: number;
}

export default function VouchersListing() {
  const [Vouchers, { loading, error }] = useVouchers();
  const { formatMessage: f, formatDate: d } = useIntl();
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const [sortByColumn, setSortByColumn] = useState("name");
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">(SortDirection.ASC);
  const [list, setList] = useState(Vouchers);

  useEffect(() => {
    setList(Vouchers);
  }, [Vouchers]);

  const sortList = ({
    sortByColumn,
    sortDirection,
  }: {
    sortByColumn: string;
    sortDirection: "ASC" | "DESC";
  }) => {
    let newList = sortBy(Vouchers, [sortByColumn]);
    if (sortDirection === SortDirection.DESC) {
      newList.reverse();
    }
    return newList;
  };

  const sort = ({
    sortBy,
    sortDirection,
  }: {
    sortBy: string;
    sortDirection: "ASC" | "DESC";
  }) => {
    const sortedList = sortList({ sortByColumn: sortBy, sortDirection });
    setSortByColumn(sortBy);
    setSortDir(sortDirection);
    setList(sortedList);
  };

  if (error) return <Error error={error} />;

  const handleOpenVoucher = ({ rowData: voucher }: { rowData: IVoucher }) => {
    if (!voucher.order) return;

    navigate(`/vouchers/o/${voucher.order.id}`);
  };

  const rowGetter = ({ index }: IRowGetter): { name: string } => {
    return list ? list[index] : {};
  };

  const renderCellValue: TableCellRenderer = ({
    rowData: voucher,
  }: {
    rowData: IVoucher;
  }) => {
    return (
      <div>
        <div className="text-bold">
          <Currency value={voucher.value} /> (
          <Currency value={voucher.original_value || 0} />)
        </div>
      </div>
    );
  };

  const renderCellBookingCode: TableCellRenderer = ({
    rowData: voucher,
  }: {
    rowData: IVoucher;
  }) => {
    return (
      <div>
        <div className="text-bold">
          {voucher.order ? voucher.order.booking_code : null}
        </div>
      </div>
    );
  };

  const renderActionIcon = () => (
    <ChevronRightIcon className="h-8 text-gray-400 self-end" />
  );

  const renderStatus = ({ rowData }: any) => {
    if (!rowData.order) return <></>;

    return <OrderStatusBadge order={rowData.order} />;
  };

  const renderContact = ({ rowData }: any) => {
    const contact = rowData.contact;
    if (!contact) return <></>;

    return (
      <div>
        <div>{contact.name}</div>
        <div className={`italic ${contact && contact.name ? "text-2xs" : ""}`}>
          {rowData.annotation}
        </div>
      </div>
    );
  };

  const renderCreatedAt = ({ cellData }: { cellData?: Date }) => (
    <div className="flex items-center">
      {d(cellData, {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })}
    </div>
  );

  return (
    <div className="px-2 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto min-h-screen">
      <div className="lg:flex lg:justify-between lg:items-start p-2 sm:p-6">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate">
            {f(messages.Vouchers)}
          </h2>
        </div>
        <div className="flex flex-center">
          <NavLink to="new">
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
                {f(messages.newVoucher)}
              </span>
            </button>
          </NavLink>
        </div>
      </div>
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            headerHeight={40}
            className="my-6"
            headerClassName="flex px-2 h-full items-center font-medium"
            overscanRowCount={10}
            rowCount={list ? list.length : 0}
            noRowsRenderer={() =>
              loading ? (
                <LoadingData />
              ) : (
                <NoResultsFromQueryYet
                  message={f(messages.noVouchersMatchingQuery)}
                />
              )
            }
            onRowClick={handleOpenVoucher}
            rowHeight={40}
            rowGetter={rowGetter}
            sortBy={sortByColumn}
            sortDirection={sortDir}
            width={width}
            ref={tableRef}
            rowClassName="flex items-center cursor-pointer hover:bg-blue-50 transition duration-200 ease-in-out text-sm text-gray-600 border-l-transparent border-b"
            sort={sort}
          >
            <Column
              label={f(messages.bookingCode)}
              className="px-2"
              dataKey="booking_code"
              width={120}
              cellRenderer={renderCellBookingCode}
            />
            <Column
              label={f(messages.creationDate)}
              dataKey="created_at"
              className="px-2 items-center"
              cellRenderer={renderCreatedAt}
              width={220}
            />
            <Column
              dataKey="id"
              cellRenderer={renderContact}
              flexGrow={1}
              label={f(messages.name)}
              width={300}
            />
            <Column
              label={f(messages.bookingCode)}
              className="px-2"
              dataKey="status_code"
              width={200}
              cellRenderer={renderStatus}
            />
            <Column
              label={f(messages.value)}
              dataKey="value"
              className="px-2 items-center"
              cellRenderer={renderCellValue}
              width={120}
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
      <Outlet />
    </div>
  );
}
