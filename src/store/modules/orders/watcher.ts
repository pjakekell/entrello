import { takeLatest } from "redux-saga/effects";

import {
  SET_CUR_ORDER,
  TOGGLE_SEAT_ORDER_ITEM,
  TOGGLE_SPLIT_ORDER_SEAT_IDS,
  TOGGLE_SPLIT_ORDER
} from "./actions";
import {
  asyncSetCurOrder,
  doToggleSeatOrderItem,
  doToggleSplitOrderSeatIds,
  doToggleSplitOrder
} from "./actions";

export const sagas = function* () {
  yield takeLatest(SET_CUR_ORDER, asyncSetCurOrder);
  yield takeLatest(TOGGLE_SEAT_ORDER_ITEM, doToggleSeatOrderItem);
  yield takeLatest(TOGGLE_SPLIT_ORDER_SEAT_IDS, doToggleSplitOrderSeatIds);
  yield takeLatest(TOGGLE_SPLIT_ORDER, doToggleSplitOrder);
};