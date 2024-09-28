import update from "immutability-helper";

import {
  SET_CUR_ORDER,
  SET_SPLIT_ORDER_ID,
  SET_SPLIT_ORDER_SEAT_IDS,
  SET_SPLIT_CANDIDATES_COUNT,
  SET_EDIT_CUR_ORDER_SEATS
} from "./actions";

export const initialState = {
  curOrderId: null,
  splitOrderId: null,
  splitOrderSeatIds: [],
  splitCandidatesCount: 0,
  editCurOrderSeats: false,
};

export const reducer = (state = initialState, action: any) => {
  const actions = {
    // [SET_RATIO]: ({ value }) => update(state, { ratio: { $set: value } }),
    [SET_CUR_ORDER]: ({ id }: any) =>
      update(state, { curOrderId: { $set: id } }),
    [SET_SPLIT_ORDER_ID]: ({ id }: any) =>
      update(state, { splitOrderId: { $set: id } }),
    [SET_SPLIT_ORDER_SEAT_IDS]: ({ ids }: any) => {
      return update(state, {
        splitOrderSeatIds: {
          $set: ids,
        },
      });
    },
    [SET_SPLIT_CANDIDATES_COUNT]: ({ count }: any) =>
      update(state, { splitCandidatesCount: { $set: count } }),
    [SET_EDIT_CUR_ORDER_SEATS]: ({ val }: any) =>
      update(state, { editCurOrderSeats: { $set: val } }),
  };
  // @ts-ignore
  return actions[action.type] ? actions[action.type](action) : state;
};