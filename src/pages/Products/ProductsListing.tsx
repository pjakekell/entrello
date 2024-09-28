import React, { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { useIntl } from "react-intl";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  AutoSizer,
  SortDirection,
  Table,
  Column,
  TableCellRenderer,
} from "react-virtualized";
import sortBy from "lodash/sortBy";
import isNil from "lodash/isNil";
import NumberFormat from "react-number-format";

import messages from "../../i18n/messages";
import { useProducts } from "../../hooks/useProducts";
import Error from "../../components/Error";
import { IPrices, IProduct } from "./interfaces";
import LoadingData from "../../components/common/LoadingData";
import NoResultsFromQueryYet from "../../components/common/NoResultsFromQueryYet";
import { useTaxGroups } from "../../hooks/useTaxGroups";
import { ITaxGroup } from "../../components/TaxGroup/interfaces";

interface IRowGetter {
  index: number;
}

export default function ProductsListing() {
  const [products, { loading, error }] = useProducts();
  const [taxGroupData, { loading: loadingTaxGroups, error: taxGroupError }] =
    useTaxGroups();
  const { formatMessage: f, formatDate: d } = useIntl();
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const [sortByColumn, setSortByColumn] = useState("name");
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">(SortDirection.ASC);
  const [list, setList] = useState(products);

  useEffect(() => {
    setList(products);
  }, [products]);

  const sortList = ({
    sortByColumn,
    sortDirection,
  }: {
    sortByColumn: string;
    sortDirection: "ASC" | "DESC";
  }) => {
    let newList = sortBy(products, [sortByColumn]);
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

  const handleOpenProduct = ({ rowData: product }: { rowData: IProduct }) => {
    navigate(`/products/${product.id}`);
  };

  const rowGetter = ({ index }: IRowGetter): { name: string } => {
    return list ? list[index] : {};
  };

  const renderCellValue: TableCellRenderer = ({
    cellData,
  }: {
    cellData?: number | string;
  }) => {
    return (
      <div>
        <div className="text-bold">{cellData}</div>
      </div>
    );
  };
  const renderProductPrice: TableCellRenderer = ({
    cellData,
  }: {
    cellData?: IPrices[];
  }) => {
    const isPricePresentOnProduct = cellData && cellData.length > 0;
    const priceValue = isPricePresentOnProduct
      ? cellData[cellData.length - 1].value
      : 0;
    return (
      <div>
        <div className="text-bold">
          {isPricePresentOnProduct ? (
            <NumberFormat
              value={priceValue / 100.0}
              thousandSeparator=" "
              decimalSeparator=","
              fixedDecimalScale
              decimalScale={2}
              displayType="text"
              prefix="€ "
            />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };

  const renderProductTaxGroup: TableCellRenderer = ({
    cellData,
  }: {
    cellData?: IPrices[];
  }) => {
    const isTaxGroupPresentOnProduct = cellData && cellData.length > 0;
    const taxGroup = isTaxGroupPresentOnProduct
      ? cellData[cellData.length - 1].tax_group_id
      : 0;
    const taxGroupName =
      !taxGroupError && !loadingTaxGroups
        ? taxGroupData.find((tg: ITaxGroup) => tg.id === taxGroup)?.name
        : null;
    return (
      <div>
        <div className="text-bold">
          {isTaxGroupPresentOnProduct ? (
            <div>
              <div className="text-bold">
                {isNil(taxGroupName) ? "N/A" : taxGroupName}
              </div>
            </div>
          ) : (
            ""
          )}
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
            {f(messages.products)}
          </h2>
          <form> {/* placeholder for when we get filters working*/}</form>
        </div>
        <div className="flex flex-center">
          <NavLink to="o/new">
            <button
              type="button"
              className="inline-flex items-center justify-center sm:justify-start text-center sm:text-left px-2 sm:px-4 sm:py-1.5 border-2 rounded-full shadow-sm text-sm font-medium text-brand-500 hover:text-white border-brand-500 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 mr-2"
            >
              <FontAwesomeIcon icon={faPlus} className="sm:mr-2 h-4 w-4" />
              <span className="uppercase sm:inline">
                {f(messages.newOrder)}
              </span>
            </button>
          </NavLink>
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
              <span className="uppercase sm:inline">
                {f(messages.newProduct)}
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
              loading || loadingTaxGroups ? (
                <LoadingData />
              ) : (
                <NoResultsFromQueryYet
                  message={f(messages.noProductsMatchingQuery)}
                />
              )
            }
            onRowClick={handleOpenProduct}
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
              label={f(messages.name)}
              className="px-2"
              dataKey="name"
              width={300}
              cellRenderer={renderCellValue}
            />
            <Column
              label={f(messages.unit)}
              dataKey="unit"
              className="px-2 items-center"
              cellRenderer={renderCellValue}
              width={200}
            />
            <Column
              label={f(messages.category)}
              dataKey="category"
              className="px-2 items-center"
              cellRenderer={renderCellValue}
              width={200}
            />
            {/* Disabled it currently based on conversation with Thorsten */}
            {/* <Column
                            label={f(messages.position)}
                            dataKey="pos"
                            className="px-2 items-center"
                            cellRenderer={renderCellValue}
                            width={200}
                        /> */}
            <Column
              label={f(messages.description)}
              dataKey="description"
              className="px-2 items-center"
              cellRenderer={renderCellValue}
              width={200}
            />
            <Column
              label={f(messages.number)}
              dataKey="num"
              className="px-2 items-center"
              cellRenderer={renderCellValue}
              width={200}
            />
            <Column
              label={f(messages.price)}
              dataKey="prices"
              className="px-2 items-center"
              cellRenderer={renderProductPrice}
              width={300}
            />
            <Column
              label={f(messages.taxGroup)}
              dataKey="prices"
              className="px-2 items-center"
              cellRenderer={renderProductTaxGroup}
              width={300}
            />
            <Column
              label={f(messages.creationDate)}
              dataKey="created_at"
              className="px-2 items-center"
              cellRenderer={renderCreatedAt}
              width={400}
            />
          </Table>
        )}
      </AutoSizer>
      <Outlet />
    </div>
  );
}
