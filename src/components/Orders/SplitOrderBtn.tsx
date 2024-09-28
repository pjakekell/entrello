import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { faSplit } from "@fortawesome/pro-regular-svg-icons/faSplit";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faXmark } from "@fortawesome/pro-regular-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEvent } from "../../hooks/useEvent";

import Tooltip, { Placement } from "../Tooltip/Tooltip";
import NonSplOrder from "../Spl/NonSplOrder";

import messages from "../../i18n/messages";
import { IOrder, IOrderItem } from "./interfaces";
import { getApolloClient } from "../../apollo-client";
import {
  FULL_ORDER_FRAGMENT, SPLIT_ORDER,
} from "../Orders/logic";
import { 
  selectSplitOrderId,
  toggleSplitOrder,
  selectSplitOrderSeatIds
} from "../../store/modules/orders/actions";
import { setChangedSeats } from "../Spl/logic";
import { useCreateSplOrder } from "../../hooks/useCreateSplOrder";
import { EVENT_FEATURE_SPL } from "../Event/logic";

interface ICreateSuborderBtn {
  order: IOrder;
}

const SplitOrderBtn = ({ order }: ICreateSuborderBtn) => {
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const [event] = useEvent(order.order_items[0]?.event_id || "");
  const splitOrderId = useSelector(selectSplitOrderId);
  const splitSeatIds = useSelector(selectSplitOrderSeatIds);
  const [isOpenNonSplOrder, setOpenNonSplOrder] = useState(false);
  const [createOrder] = useCreateSplOrder(true);
  const client = getApolloClient();

  const handleStartSplitOrder = () => {
    if(!!(event?.features & EVENT_FEATURE_SPL))
      dispatch(toggleSplitOrder(order.id));
    else
      setOpenNonSplOrder(true);
  };

  const handleClaimSeats = async () => {
    const items = splitSeatIds.map((seatId: string) => {
      const origItem = order.order_items.find(
        (item: IOrderItem) => item.seat_id === seatId
      );
      return {
        event_id: event?.id,
        seat_id: seatId,
        qty: 1,
        price_id: origItem ? origItem.price_id : "",
      };
    });
    const res = await createOrder({
      variables: { split_order_id: order.id, items },
    });
    if (res && res.data && res.data.CreateOrder) {
      const order = res.data.CreateOrder;
      client.writeFragment({
        id: `Order:${order.id}`,
        fragment: FULL_ORDER_FRAGMENT,
        fragmentName: "Order",
        data: order,
      });
    }
    dispatch(setChangedSeats(0));
    // deselectAllSeats();
  };

  const splitCandidates = splitSeatIds.length;

  return (
    <div
      className={`flex items-stretch border-2 border-fuchsia-600 rounded group h-10 cursor-pointer${
        splitOrderId ? " hover:bg-white" : " hover:bg-fuchsia-600"
      }`}
    >
      {splitOrderId ? (
        <Tooltip
          placement={Placement.left}
          content={f(messages.splitSelectedSeatsIntoSeparateOrder)}
        >
          <div
            className={`mr-2 px-4 bg-fuchsia-600 flex items-center${
              splitCandidates > 0 ? "" : " opacity-25"
            }`}
            onClick={handleClaimSeats}
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-white" />
            <div className="pl-1 text-white text-sm uppercase tracking-wide">
              {f(messages.order)} ({splitCandidates} {f(messages.seats)})
            </div>
          </div>
        </Tooltip>
      ) : null}
      <Tooltip
        placement={Placement.left}
        content={splitOrderId ? f(messages.cancel) : f(messages.splitOrderDesc)}
      >
        <div onClick={handleStartSplitOrder} className="pb-1 pl-1 pr-2 pt-2">
          <FontAwesomeIcon
            icon={splitOrderId ? faXmark : faSplit}
            className={`w-5 h-5 text-fuchsia-600${
              splitOrderId
                ? " group-hover:text-fuchsia-600"
                : " group-hover:text-white"
            }`}
          />
        </div>
      </Tooltip>
      {
        isOpenNonSplOrder &&
        <NonSplOrder
          eventId={event?.id || ""}
          type={SPLIT_ORDER}
          order={order}
          onHide={() => setOpenNonSplOrder(false)}
        />
      }
    </div>
  );
};

export default SplitOrderBtn;
