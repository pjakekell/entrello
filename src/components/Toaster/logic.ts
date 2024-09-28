import update from "immutability-helper";
import { createSelector } from "reselect";

// const SET_RATIO = 'SPL_SET_RATIO'
const SET_MSG = "TOASTER_SET_MSG";

export interface IMsg {
  title: string;
  level?: "info" | "warning" | "error" | "success";
  desc?: string;
}

export const initialState = {
  msg: null,
};

export const setMsg = (msg: IMsg | null) => ({
  type: SET_MSG,
  msg,
});

export const reducer = (state = initialState, action: any) => {
  const actions = {
    [SET_MSG]: ({ msg }: any) =>
      update(state, {
        msg: { $set: msg },
      }),
  };
  // @ts-ignore
  return actions[action.type] ? actions[action.type](action) : state;
};

export const container = (state: any) => state.toaster;

export const selectMsg = createSelector(container, (state) => state.msg);
