import React, { useEffect, useState, useCallback, useMemo } from "react";
import classNames from "classnames";
import { useIntl } from "react-intl";
import { setEditCurOrderSeats } from "../../store/modules/orders/actions"; 
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { faClose } from "@fortawesome/pro-regular-svg-icons";

import { IOrder, IGroupedItem } from "./interfaces";
import Currency from "../Currency";
import messages from "../../i18n/messages";
import { useUpdateOrderItem } from "../../hooks/useUpdateOrderItem";
import { useDeleteOrderItem } from "../../hooks/useDeleteOrderItem";

import LoadingIcon from "../Btn/LoadingIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import { usePrices } from "../../hooks/usePrices";
import { IPrice } from "../Prices/interfaces";
import { NameSelectInputField } from "../FormHelpers/NameSelectField";
import { NumberSelectInputField } from "../FormHelpers/NumberSelectInputField";

interface IGroupedItemParams {
  item: IGroupedItem;
  order: IOrder;
}

const GroupedItem = ({ item, order }: IGroupedItemParams) => {
  const { formatMessage: f } = useIntl();
  const [selectedPrice, setSelectedPrice] = useState<any>(null);
  const [updateOrderItem] = useUpdateOrderItem(order.id);
  const [deleteOrderItem] = useDeleteOrderItem(order.id);
  const [qty, setQty] = useState<any>(null);
  const [label, setLabel] = useState<string>("");
  const [isOpenDeleteDropdown, setOpenDeleteDropdown] = useState(false);
  const [prices] = usePrices(item.event_id);

  const qtyOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= 10; i++)
      options.push({ value: i, label: `${i}`});
    return options;
  }, []);

  const priceOptions = useMemo(() => {
    if(!prices) return [];
    const curPrice = prices.find((price: IPrice) => price.id === item.price_id);
    if(!curPrice) return [];
    //if current price has a parent id and current order_item has no seat_id, get the prices with the same parent id (siblings)
    const pricesWithSameParent = (curPrice.parent_id && !curPrice.seat_ids) ? prices.filter((price: IPrice) => price.parent_id === curPrice.parent_id) : [];
    if(!pricesWithSameParent.length)
      pricesWithSameParent.push(curPrice);
    return pricesWithSameParent.map((price: IPrice) => ({ value: price.id, label: price.name }));
  }, [prices, item.price_id]);

  useEffect(() => {
    const initPrice = () => {
      setSelectedPrice(priceOptions.find((option: any) => option.value === item.price_id));
    }
    initPrice();
  }, [priceOptions, item.price_id]);

  useEffect(() => {
    const initQty = () => {
      const initialOption = qtyOptions.find(option => option.value === item.qty);
      setQty(initialOption);
      setLabel(item.qty?.toString());
    }
    initQty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qtyOptions, item.qty]);

  const handleDeleteOrderItem = useCallback(async () => {
    const deleteOrderItemId = order.order_items.find(oItem => oItem.price_id === item.price_id)?.id;
    if(deleteOrderItemId)
      deleteOrderItem([deleteOrderItemId]);
    setOpenDeleteDropdown(false);
  }, [order.order_items, item.price_id, deleteOrderItem]);

  useEffect(() => {
    const updateOrderQty = async () => {
      if(!selectedPrice) return;
      const curOrderItemId = order.order_items.find(orderItem => orderItem.price_id === selectedPrice.value)?.id || "";
      await updateOrderItem({ qty: parseInt(label), price_id: selectedPrice.value }, curOrderItemId);
    }
    updateOrderQty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  return (
    <div className={classNames(TABLE_MAPS.TR)}>
      <div className="pr-2 flex-grow">
        <div className={classNames(TABLE_MAPS.DESC)}>{item.title}</div>
        {
          !item.price_name
          ? <div className={classNames(TABLE_MAPS.SUBTITLE)}>{item.subtitle}</div>
          : <div className={classNames(TABLE_MAPS.SUBTITLE)}>
              <NameSelectInputField
                options={priceOptions}
                value={selectedPrice}
                onChange={setSelectedPrice}
                isDisabled={priceOptions.length <= 1}
              />
            </div>
        }
      </div>
      <div className={classNames(TABLE_MAPS.VALUE)}>
        <Currency value={item.price_value} />
      </div>
      <div className={classNames(TABLE_MAPS.QTY)}>
        <span className="absolute top-2 left-2 text-2xs text-brand-500 underline cursor-pointer">{label}</span>
        <NumberSelectInputField
          options={qtyOptions}
          value={qty}
          setLabel={setLabel}
          onChange={setQty}
        />
      </div>
      <div className={classNames(TABLE_MAPS.VALUE)}>
        <Currency value={item.total} />
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
          <p className="truncate text-brand-500 cursor-pointer" onClick={handleDeleteOrderItem}>{f(messages.deleteItem)}</p>
        </div>
      </div>     
    </div>
  );
};

const TABLE_MAPS = {
  TR: "pt flex items-center mx-4",
  DESC: "flex-grow",
  QTY: "relative w-12 pr-2 py-2 ml-4 mr-4 text-right text-brand-500",
  VALUE: "relative w-12 py-2 text-right",
  SUBTITLE: "text-gray-600"
};

const GroupedItemHeader = () => {
  const { formatMessage: f } = useIntl();
  return (
    <div
      className={classNames(
        TABLE_MAPS.TR,
        "text-gray-400 text-2xs uppercase border-b border-gray-200"
      )}
    >
      <div className={classNames(TABLE_MAPS.DESC)}>
        {f(messages.description)}
      </div>
      <div className={classNames(TABLE_MAPS.VALUE)}>
        {f(messages.singlePriceAbbr)}
      </div>
      <div className={classNames(TABLE_MAPS.QTY)}>{f(messages.qtyAbbr)}</div>
      <div className={classNames(TABLE_MAPS.VALUE)}>EUR</div>
      <div className={classNames(TABLE_MAPS.VALUE)}></div>
    </div>
  );
};

interface IGroupedItemFooterParams {
  qty?: number;
  value: number;
  intrinsic?: boolean;
}

const GroupedItemFooter = ({
  qty,
  value,
  intrinsic,
}: IGroupedItemFooterParams) => {
  const { formatMessage: f } = useIntl();
  return (
    <div
      className={classNames(
        TABLE_MAPS.TR,
        !intrinsic && "font-bold border-t border-gray-500"
      )}
    >
      <div
        className={classNames(TABLE_MAPS.DESC, "uppercase font-bold text-2xs")}
      >
        <div className="pr-4">{intrinsic ? null : f(messages.total)}</div>
      </div>
      <div className={classNames(TABLE_MAPS.QTY)}></div>
      <div className={classNames(TABLE_MAPS.QTY)}>
        {qty && qty > 0 ? qty : null}
      </div>
      <div className={classNames(TABLE_MAPS.VALUE)}>
        <Currency value={value} />
      </div>
      <div className={classNames(TABLE_MAPS.VALUE)}></div>
    </div>
  );
};

interface IGroupedItemsListingParams {
  order: IOrder;
}

export const GroupedItemsListingForSellDialog = ({
  order,
}: IGroupedItemsListingParams) => {
  if (!order.order_items)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingIcon color="text-indigo-400" />
      </div>
    );

  const qty = order.grouped_items.reduce((acc, i) => acc + i.qty, 0);
  const invoicedTotal = order.grouped_items.reduce(
    (acc, i) => acc + i.total,
    0
  );

  return (
    <div className="py-4 text-xs">
      <div className="text-xs my-2">
        <GroupedItemHeader />
        {order.grouped_items.map((item: IGroupedItem, i: number) => (
          <GroupedItem
            item={{
              ...item,
              title: order.title,
              subtitle: order.subtitle
            }}
            order={order}
            key={`grouped-item-${i}`} />
        ))}
        <GroupedItemFooter qty={qty} value={invoicedTotal} />
      </div>
    </div>
  );
};

export default function GroupedItemsListing({
  order,
}: IGroupedItemsListingParams) {
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleToggleEditSeats = (_e: any) => {
    dispatch(setEditCurOrderSeats(true));
  };
  const [areTicketsInOrder, setAreTicketsInOrder] = useState(false);
  const [areProductsInOrder, setAreProductsInOrder] = useState(false);

  useEffect(() => {
    const { order_items } = order;
    if (order_items.length > 0) {
      const isEventLinked = order_items.findIndex(item => item.event_id !== "") !== -1;
      const isProductInOrder = order_items.findIndex(item => item.product_id !== "") !== -1;
      setAreTicketsInOrder(isEventLinked);
      setAreProductsInOrder(isProductInOrder);
    }
  }, [order])

  if (!order.order_items)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingIcon color="text-indigo-400" />
      </div>
    );

  const qty = order.grouped_items.reduce((acc, i) => acc + i.qty, 0);
  const invoicedTotal = order.grouped_items.reduce(
    (acc, i) => acc + i.total,
    0
  );

  return (
    <div className="py-4 text-xs">
      {areTicketsInOrder ? <div className="ml-6 mr-4 flex justify-between">
        <div className="w-32 text-gray-400 uppercase">
          {f(messages.tickets)}
        </div>
        <button
          onClick={handleToggleEditSeats}
          className="border-transparent hover:border-gray-400 border-2 py-1 rounded flex items-center"
        >
          <div className="text-gray-500 uppercase text-2xs mr-1 leading-none">
            {f(messages.showTickets)}
          </div>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="w-3 h-3 text-gray-400"
          />
        </button>
      </div> : null}
      {areProductsInOrder ? <div className="ml-6 mr-4 flex justify-between">
        <div className="w-32 text-gray-400 uppercase">
          {f(messages.products)}
        </div>
        <button
          onClick={() => navigate("editOrder")}
          className="border-transparent hover:border-gray-400 border-2 py-1 rounded flex items-center"
        >
          <div className="text-gray-500 uppercase text-2xs mr-1 leading-none">
            {f(messages.editProducts)}
          </div>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="w-3 h-3 text-gray-400"
          />
        </button>
      </div> : null}
      <div className="text-xs flex flex-grow items-center my-4">
        <div className="p-2 border-t border-b border-gray-200 flex-grow">
          <GroupedItemHeader />
          {order.grouped_items.map((item: IGroupedItem, i: number) => (
            <GroupedItem
              item={{
                ...item,
                title: order.title,
                subtitle: order.subtitle
              }}
              order={order}
              key={`grouped-item-${i}`} />
          ))}
          <GroupedItemFooter qty={qty} value={invoicedTotal} />
        </div>
      </div>
    </div>
  );
}
