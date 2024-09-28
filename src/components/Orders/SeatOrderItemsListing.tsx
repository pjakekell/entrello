import React, { useState, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/pro-regular-svg-icons";

import { setHighlightSeat } from "../Spl/tools/seat_active_toggles";
import Currency from "../Currency";

import messages from "../../i18n/messages";
import { IOrder, IOrderItem } from "./interfaces";
import { NumberSelectInputField } from "../FormHelpers/NumberSelectInputField";
import { useDeleteOrderItem } from "../../hooks/useDeleteOrderItem";
import { useUpdateOrderItem } from "../../hooks/useUpdateOrderItem";

interface ISeatItemParams {
  item: IOrderItem;
  setOrder: React.Dispatch<React.SetStateAction<IOrder>>;
  i: number;
  orderId: string;
}

const SeatItem = ({ item, setOrder, i, orderId }: ISeatItemParams) => {
  const { formatMessage: f } = useIntl();
  const [deleteOrderItem] = useDeleteOrderItem(orderId);
  const [updateOrderItem] = useUpdateOrderItem(orderId);
  const qtyOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= 9; i++)
      options.push({ value: i, label: `${i}`});
    return options;
  }, []);
  const [qty, setQty] = useState<any>(null);
  const [label, setLabel] = useState<string>("");
  const [isOpenDeleteDropdown, setOpenDeleteDropdown] = useState(false);

  const handleHighlightSeat = () =>
    setHighlightSeat(item.seat_id, "highlight", true);
  const handleMarkSeatDeleted = () => {
    deleteOrderItem([item.id]);
    setHighlightSeat(item.seat_id, "deleted", true);
    setOpenDeleteDropdown(false);
  };

  useEffect(() => {
    const initialOption = qtyOptions.find(option => option.value === item.qty);
    setQty(initialOption);
    setLabel(item.qty?.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qtyOptions]);

  useEffect(() => {
    const updateOrderQty = () => {
      setOrder(prevOrder => {
        const customOrder = JSON.parse(JSON.stringify(prevOrder));
        customOrder.order_items[i].qty = parseInt(label);
        return customOrder;
      });
      updateOrderItem({ qty: parseInt(label), price_id: item.price_id }, item.id);
    }
    updateOrderQty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  return (
    <div
      className={classNames(
        TABLE_MAPS.TR,
        item.deleted ? " deleted" : ""
      )}
      onMouseOver={handleHighlightSeat}
    >
      <div className={classNames(TABLE_MAPS.POS)}>
        <span className="absolute top-3 left-2 text-2xs text-brand-500 underline cursor-pointer">{label}</span>
        <NumberSelectInputField
          options={qtyOptions}
          value={qty}
          setLabel={setLabel}
          onChange={setQty}
        />
      </div>
      <div className={classNames(TABLE_MAPS.DESC)}>
        {item.subtitle} {item.desc} {item.deleted ? "d" : ""}
      </div>
      <div className={classNames(TABLE_MAPS.VALUE)}>
        <Currency value={item.static_price || 0} />
      </div>
      <div className={classNames(TABLE_MAPS.VALUE)}>
        <FontAwesomeIcon
          className="text-gray-400 cursor-pointer"
          onClick={() => setOpenDeleteDropdown(!isOpenDeleteDropdown)}
          icon={faClose}
        />
        <div className={
          classNames(
            "absolute p-2 top-6 right-0 border border-solid border-gray-400 bg-white shadow-md text-2xs z-10",
            isOpenDeleteDropdown ? "" : "hidden"
          )
        }>
          <p className="truncate text-brand-500 cursor-pointer" onClick={handleMarkSeatDeleted}>{f(messages.deleteItem)}</p>
        </div>
      </div>
    </div>
  );
};

const TABLE_MAPS = {
  TR: "pt flex items-center mx-4",
  POS: "relative flex-grow pr-2 py-2",
  DESC: "w-57 pr-2 py-2 ml-4 mr-4 text-right",
  VALUE: "relative w-12 py-2 text-right",
};

const SeatItemHeader = () => {
  const { formatMessage: f } = useIntl();
  return (
    <div
      className={classNames(
        TABLE_MAPS.TR,
        "text-gray-400 text-2xs uppercase border-b border-gray-200"
      )}
    >
      <div className={classNames(TABLE_MAPS.POS)}>{f(messages.posAbbr)}</div>
      <div className={classNames(TABLE_MAPS.DESC)}>{f(messages.description)}</div>
      <div className={classNames(TABLE_MAPS.VALUE)}>EUR</div>
      <div className={classNames(TABLE_MAPS.VALUE)}></div>
    </div>
  );
};

interface ISeatItemFooterParams {
  qty?: number;
  value: number;
  intrinsic?: boolean;
}

const SeatItemFooter = ({ value, intrinsic }: ISeatItemFooterParams) => {
  const { formatMessage: f } = useIntl();

  return (
    <div
      className={classNames(
        TABLE_MAPS.TR,
        !intrinsic && "font-bold border-t border-gray-500"
      )}
    >
      <div className={classNames(TABLE_MAPS.POS, "uppercase font-bold text-2xs")}>
        {intrinsic ? null : f(messages.total)}
      </div>
      <div className={classNames(TABLE_MAPS.DESC)}></div>
      <div className={classNames(TABLE_MAPS.VALUE)}>
        <Currency value={value} />
      </div>
      <div className={classNames(TABLE_MAPS.VALUE)}>
      </div>
    </div>
  );
};

interface ISeatOrderItemsListingParams {
  order: IOrder;
  setOrder: React.Dispatch<React.SetStateAction<IOrder>>;
}

export default function SeatOrderItemsListing({
  order,
  setOrder
}: ISeatOrderItemsListingParams) {
  if (!order.order_items)
    return (
      <div className="order-info-box">
        <div className="p-4"></div>
      </div>
    );

  const qty = order.order_items.reduce(
    (acc, i) => (i.seat_id !== null ? acc + i.qty : acc),
    0
  );
  const intrinsicTotal = order.order_items.reduce(
    (acc, i) => (i.seat_id !== null ? acc + (i.static_price || 0) : acc),
    0
  );
  const invoicedTotal = order.order_items.reduce(
    (acc, i) => (i.seat_id !== null ? acc + (i.static_price || 0) : acc),
    0
  );

  return (
    <div className="text-xs flex flex-grow items-center my-4">
      <div className="p-2 border-t border-b border-gray-200 flex-grow">
        <SeatItemHeader />
        <div className="order-items-content">
          {order.order_items
            .filter((item: IOrderItem) => item.seat_id !== null && !item.deleted)
            .map((item: IOrderItem, i: number) => (
              <SeatItem
                item={item}
                setOrder={setOrder}
                key={`order-item-${i}`}
                i={i}
                orderId={order.id}
              />
            ))}
          {invoicedTotal !== intrinsicTotal ? (
            <SeatItemFooter value={intrinsicTotal} intrinsic />
          ) : null}
        </div>
        <SeatItemFooter qty={qty} value={invoicedTotal} />
      </div>
    </div>
  );
}
