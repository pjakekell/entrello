import { select, delay, put } from "redux-saga/effects";
import { createSelector } from "reselect";
import { IOrder, IOrderItem } from "../../../components/Orders/interfaces";

import { deselectAllSeats } from "../../../components/Spl/events/mouse";
import {
  disableInactiveSeats,
  enableAllSeats,
  setActiveSeatsByOrderId,
  setHighlightSeat,
} from "../../../components/Spl/tools/seat_active_toggles";
import { getApolloClient } from "../../../apollo-client";
import history from "../../../history";
import { FETCH_EVENT_BY_ID } from "../../../components/Event/logic";
import { FETCH_ORDER_BY_ID, ORDER_ITEM_FRAGMENT } from "../../../components/Orders/logic";
import { SEAT_FRAGMENT } from "../../../components/Spl/logic";

//CONSTANTS
export const SET_CUR_ORDER = "SET_CUR_ORDER";
export const SET_EDIT_CUR_ORDER_SEATS = "SET_EDIT_CUR_ORDER_SEATS";
export const TOGGLE_SEAT_ORDER_ITEM = "TOGGLE_SEAT_ORDER_ITEM";
export const TOGGLE_SPLIT_ORDER_SEAT_IDS = "TOGGLE_SPLIT_ORDER_SEAT_IDS";
export const SET_SPLIT_ORDER_ID = "SET_SEAT_ORDER_ID";
export const SET_SPLIT_ORDER_SEAT_IDS = "SET_SEAT_ORDER_SEAT_IDS";
export const TOGGLE_SPLIT_ORDER = "TOGGLE_SPLIT_ORDER";
export const SET_SPLIT_CANDIDATES_COUNT = "SET_SPLIT_CANDIDATES_COUNT";

export const toggleSplitOrder = (id: string) => ({
  type: TOGGLE_SPLIT_ORDER,
  id,
});

export const setSplitCandidatesCount = (count: number) => ({
  type: SET_SPLIT_CANDIDATES_COUNT,
  count,
});

export const setSplitOrderId = (id: string | null) => ({
  type: SET_SPLIT_ORDER_ID,
  id,
});

export const setEditCurOrderSeats = (val: boolean) => ({
  type: SET_EDIT_CUR_ORDER_SEATS,
  val,
});

export const setCurOrder = (id: string | null) => ({
  type: SET_CUR_ORDER,
  id,
});

export const toggleSeatOrderItem = (id: string) => ({
  type: TOGGLE_SEAT_ORDER_ITEM,
  id,
});

export const toggleSplitOrderSeatIds = (ids: string[]) => ({
  type: TOGGLE_SPLIT_ORDER_SEAT_IDS,
  ids,
});

export const setSplitOrderSeatIds = (ids: string[]) => ({
  type: SET_SPLIT_ORDER_SEAT_IDS,
  ids,
});

export const container = (state: any) => state.orders;

export const selectCurOrder = createSelector(
  container,
  (state) => state.curOrderId
);

export const selectEditCurOrderSeats = createSelector(
  container,
  (state) => state.editCurOrderSeats
);

export const selectSplitOrderId = createSelector(
  container,
  (state) => state.splitOrderId
);

export const selectSplitOrderSeatIds = createSelector(container, (state) => [
  ...state.splitOrderSeatIds,
]);

export const selectSplitCandidatesCount = createSelector(
  container,
  (state) => state.splitCandidatesCount
);

export function* asyncSetCurOrder({ id }: any) {
  if (id) {
    history.push(
      `${window.location.pathname.split("/spl")[0]}/spl${`/o/${id}`}`
    );
  } else {
    history.push(`${window.location.pathname.split("/spl")[0]}/spl`);
  }

  yield delay(100);
  if (id) {
    setActiveSeatsByOrderId(id);
    return;
  }
  deselectAllSeats();
}

export function* doToggleSeatOrderItem({ id: seatId }: any) {
  const client = getApolloClient();
  const orderId: string = yield select(selectCurOrder);
  const data = client.readQuery({
    query: FETCH_ORDER_BY_ID,
    variables: { id: orderId },
  });
  const order: IOrder | null = data.order;
  if (!order) return;

  const item = order.order_items.find(
    (item: IOrderItem) => item.seat_id === seatId
  );
  if (item) return setSeatDeleted(item, seatId);

  setSeatAdded(order, seatId);
}

function setSeatAdded(order: IOrder, seatId: string) {
  const client = getApolloClient();
  const seat = client.readFragment({
    id: `Seat:${seatId}`,
    fragment: SEAT_FRAGMENT,
  });
  const eventId = window.location.pathname
    .split("/events/")[1]
    .split("/spl/")[0];

  const event = client.readQuery({
    query: FETCH_EVENT_BY_ID,
    variables: {
      id: eventId,
    },
  });
  const data = {
    __typename: "OrderItem",
    desc: `${seat.fpos.sec.lb} ${seat.fpos.sec.num} ${seat.fpos.sgr.lb} ${seat.fpos.sgr.num} ${seat.fpos.seat.lb} ${seat.fpos.seat.num}`,
    event_id: eventId,
    intrinsic_total: 0,
    invoiced_total: 0,
    product_id: "",
    qty: 1,
    subtitle: "save to get price",
    tax: 0,
    tax_rate: 0,
    title: `Ticket: ${event.title}`,
    seat_id: seatId,
    id: `new${new Date().getTime().toString()}`,
    deleted: null,
  } as any;
  const newOrderItems = [...order.order_items, data];
  client.cache.modify({
    id: `Order:${order.id}`,
    fields: {
      order_items() {
        return newOrderItems.map((i) => ({ __ref: `OrderItem:${i.id}` }));
      },
    },
  });
  setHighlightSeat(seatId, "active", true);
}

function setSeatDeleted(item: IOrderItem, seatId: string) {
  const client = getApolloClient();
  const deletedData = {
    deleted:
      item.deleted && item.deleted.at
        ? null
        : { at: Math.floor(new Date().getTime() / 1000) },
  };
  client.writeFragment({
    id: `OrderItem:${item.id}`,
    fragment: ORDER_ITEM_FRAGMENT,
    data: deletedData,
  });
  if (item.deleted) {
    setHighlightSeat(seatId, "deleted", false);
    setHighlightSeat(seatId, "active", true);
    return;
  }
  const seatEl = document.getElementById(`#seat-${seatId}`);
  if (seatEl && seatEl.className.match(/order-[0-9a-f]+/)) {
    setHighlightSeat(seatId, "deleted", true);
    return;
  }
  setHighlightSeat(seatId, "active", false);
}

export function* doToggleSplitOrder({ id }: any) {
  const splitOrderId: string = yield select(selectSplitOrderId);
  if (splitOrderId) {
    yield put(setSplitOrderId(null));
    enableAllSeats();
    return;
  }
  yield put(setSplitOrderId(id));
  disableInactiveSeats(id);
}

export function* doToggleSplitOrderSeatIds({ ids }: any) {
  const splitIds: string[] = yield select(selectSplitOrderSeatIds);
  ids.forEach((id: string) => {
    const idx = splitIds.indexOf(id);
    idx >= 0 ? splitIds.splice(idx, 1) : splitIds.push(id);
  });
  yield put(setSplitCandidatesCount(splitIds.length));
  yield put(setSplitOrderSeatIds(splitIds));
}
