import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "@apollo/react-hooks";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SeatOrderItemsListing from "./SeatOrderItemsListing";

import { IOrder, IOrderItem } from "./interfaces";
import {
  ORDER_TYPE_OPTION,
  FETCH_ORDER_BY_ID,
} from "../Orders/logic";
import { setEditCurOrderSeats } from "../../store/modules/orders/actions";
import messages from "../../i18n/messages";
import { faClose } from "@fortawesome/pro-regular-svg-icons";
import SaveBtn from "../Settings/SaveBtn";
import { useUpdateOrderItem } from "../../hooks/useUpdateOrderItem";

interface IEditSeatsInfoParams {
  id: string;
}

export default function EditSeatsInfo({ id }: IEditSeatsInfoParams) {
  const dispatch = useDispatch();
  const { formatMessage: f } = useIntl();
  const { data } = useQuery(FETCH_ORDER_BY_ID, {
    variables: { id },
    fetchPolicy: "cache-first",
  });
  let order: IOrder = data ? data.order : null;
  const [customOrder, setCustomOrder] = useState(order);
  const [updateOrderItem] = useUpdateOrderItem(order?.id);
  if (!customOrder) return <></>;
console.log("customOrder", customOrder);
  const handleSave = () => {
    customOrder.order_items.forEach(async (orderItem: IOrderItem) => {
      await updateOrderItem({ qty: orderItem.qty, price_id: orderItem.price_id }, orderItem.id);
    })
  };

  const handleClose = () => dispatch(setEditCurOrderSeats(false));

  return (
    <div className="py-4 text-xs">
      <div className="ml-6 mr-6 flex justify-between">
        <div className="flex-grow pr-4 text-gray-400 text-xs uppercase">
          {f(messages.editSeats)}
          {customOrder.order_type === ORDER_TYPE_OPTION ? (
            <div className="ml-2 text-small text-uppercase">
              {f(messages.allocation)}
            </div>
          ) : null}
        </div>
        <FontAwesomeIcon
          className="text-gray-400 cursor-pointer"
          onClick={handleClose}
          icon={faClose}
        />
      </div>
      <SeatOrderItemsListing
        order={customOrder}
        setOrder={setCustomOrder}
      />
      <div className="mr-6">
        <SaveBtn onClick={handleSave}/>
      </div>
    </div>
  );
}
