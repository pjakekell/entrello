import gql from "graphql-tag";
import update from "immutability-helper";
import isEmpty from "lodash/isEmpty";
import { createSelector } from "reselect";
import { select, takeLatest } from "redux-saga/effects";
import { calcSelectionDims } from "./svg_helpers";
import { getApolloClient } from "../../apollo-client";
import { ISeat, ISecPlacement } from "./interfaces";
import { pick } from "lodash";
// import { getActiveSvgSeats } from "./tools/draw_seat";
//

export const SEAT_STATUS_AVAILABLE = 0b0;
export const SEAT_STATUS_LOCKED = 0b1; //             00000001   1
export const SEAT_STATUS_HIDDEN = 0b1 << 1; //        00000010   2
export const SEAT_STATUS_OFFERED = 0b1 << 2; //       00000100   4
export const SEAT_STATUS_CLAIMED = 0b1 << 3; //       00001000   8
export const SEAT_STATUS_OPTION = 0b1 << 4; //        00010000  16
export const SEAT_STATUS_RESERVATION = 0b1 << 5; //   00100000  32
export const SEAT_STATUS_BOOKED = 0b1 << 6; //        01000000  64
export const SEAT_STATUS_PAID = 0b1 << 7; //          10000000 128

// const SET_RATIO = 'SPL_SET_RATIO'
const SET_CURSOR = "SPL_SET_CURSOR";
const SET_ACTIVE_TOOL = "SPL_SET_ACTIVE_TOOL";
const SET_ACTIVE_LAYER_ID = "SPL_SET_ACTIVE_LAYER_ID";
const SET_ZOOM_LEVEL = "SPL_SET_ZOOM_LEVEL";
// const SET_PAN_ZOOM = 'SPL_PAN_ZOOM'
const TOGGLE_GRID = "SPL_TOGGLE_GRID";
const SET_MOUSE_UP = "SPL_SET_MOUSE_UP";
const SET_SEC_PLACEMENT = "SET_SEC_PLACEMENT";
const TOGGLE_SHAPES_SELECTED = "SPL_TOGGLE_SHAPES_SELECTED";
const SET_ACTIVE_SEAT_IDS = "SPL_SET_ACTIVE_SEAT_IDS";
const SET_SEAT_CANDIDATES = "SPL_SET_SEAT_CANDIDATES";
const SET_CHANGED_SEATS = "SPL_SET_CHANGED_SEATS";

export interface ShapeIDsI {
  toggleShapeIDs: string[];
  [key: string]: any;
}

export const initialState = {
  // ratio: 20,
  cursor: null,
  zoomLevel: 1,
  mouseUp: false,
  cursorActive: false,
  activeLayerID: null,
  selectedShapeIDs: [] as string[],
  activeSeatIds: [] as string[],
  activeTool: "select",
  secPlacement: null,
  changedSeatsQty: 0,
  seatCandidates: [] as ISeat[],
  showGrid: true,
};

// export const setRatio = () => ({
//   type: SET_RATIO,
// })

export const setCursor = (coords: [number]) => ({
  type: SET_CURSOR,
  coords,
});

export const setSeatCandidates = (seats: ISeat[]) => ({
  type: SET_SEAT_CANDIDATES,
  seats,
});

export const setChangedSeats = (qty: number) => ({
  type: SET_CHANGED_SEATS,
  qty,
});

export const setActiveSeatIds = (ids: string[]) => ({
  type: SET_ACTIVE_SEAT_IDS,
  ids,
});

export const setActiveTool = (name: string | null) => ({
  type: SET_ACTIVE_TOOL,
  name,
});

export const setActiveLayerID = (id: string) => ({
  type: SET_ACTIVE_LAYER_ID,
  id,
});

export const setSecPlacement = (secPlacement: ISecPlacement) => ({
  type: SET_SEC_PLACEMENT,
  secPlacement,
});

export const setZoomLevel = (level: number) => ({
  type: SET_ZOOM_LEVEL,
  level,
});

// export const setPanZoom = (panZoom:boolean) => ({
//   type: SET_PAN_ZOOM,
//   panZoom,
// })

export const toggleGrid = (show: boolean) => ({
  type: TOGGLE_GRID,
  show,
});

export const toggleSelectedShapes = (toggleShapeIDs: string[]) => ({
  type: TOGGLE_SHAPES_SELECTED,
  toggleShapeIDs,
});

export const awaitAckMouseUp = () => ({
  type: SET_MOUSE_UP,
  value: true,
});

export const ackMouseUp = () => ({
  type: SET_MOUSE_UP,
  value: false,
});

// why are we putting the "any"-type after all reducer actions?
// because we think, it should be required to use the action for reducers
// and we typecheck them
export const reducer = (state = initialState, action: any) => {
  const toggleShapesSelected = ({ toggleShapeIDs }: ShapeIDsI) => {
    const selShapeIDs: string[] = state.selectedShapeIDs;
    // if (!toggleShapeIDs || toggleShapeIDs.length < 1 || isEmpty(toggleShapeIDs[0])) return state

    toggleShapeIDs = toggleShapeIDs || [];
    if (selShapeIDs.includes(toggleShapeIDs[0]))
      return update(state, {
        selectedShapeIDs: {
          $set: selShapeIDs.filter((id) => !toggleShapeIDs.includes(id)),
        },
      });
    return update(state, {
      selectedShapeIDs: { $set: selShapeIDs.concat(toggleShapeIDs) },
    });
  };

  const actions = {
    // [SET_RATIO]: ({ value }) => update(state, { ratio: { $set: value } }),
    [SET_CURSOR]: ({ coords }: any) =>
      update(state, {
        cursor: { $set: calcSelectionDims(state.cursor, coords) },
        cursorActive: { $set: !!coords },
      }),
    [SET_MOUSE_UP]: ({ value }: any) =>
      update(state, { mouseUp: { $set: value } }),
    [SET_ACTIVE_TOOL]: ({ name }: any) =>
      update(state, { activeTool: { $set: name } }),
    [SET_SEC_PLACEMENT]: ({ secPlacement }: any) =>
      update(state, { secPlacement: { $set: secPlacement } }),
    [SET_ACTIVE_LAYER_ID]: ({ id }: any) =>
      update(state, { activeLayerID: { $set: id } }),
    [SET_ACTIVE_SEAT_IDS]: ({ ids }: any) =>
      update(state, { activeSeatIds: { $set: ids } }),
    [SET_ZOOM_LEVEL]: ({ level }: any) =>
      update(state, { zoomLevel: { $set: level } }),
    // [SET_PAN_ZOOM]: ({ panZoom }:any) => update(state, { panZoom: { $set: panZoom } }),
    [TOGGLE_GRID]: ({ show }: any) =>
      update(state, { showGrid: { $set: show } }),
    [SET_SEAT_CANDIDATES]: ({ seats }: any) =>
      update(state, { seatCandidates: { $set: seats } }),
    [TOGGLE_SHAPES_SELECTED]: toggleShapesSelected,
    [SET_CHANGED_SEATS]: ({ qty }: any) =>
      update(state, { changedSeatsQty: { $set: qty } }),
  };
  // @ts-ignore
  return actions[action.type] ? actions[action.type](action) : state;
};

export const container = (state: any) => state.spl;

export const selectActiveTool = createSelector(
  container,
  (state) => state.activeTool
);

export const selectActiveSeatIds = createSelector(
  container,
  (state) => state.activeSeatIds
);

export const selectActiveLayerID = createSelector(
  container,
  (state) => state.activeLayerID
);

export const selectSecPlacement = createSelector(
  container,
  (state) => state.secPlacement
);

export const selectZoomLevel = createSelector(
  container,
  (state) => state.zoomLevel
);

export const selectPanZoom = createSelector(
  container,
  (state) => state.panZoom
);

export const selectMouseUp = createSelector(
  container,
  (state) => state.mouseUp
);

export const selectShowGrid = createSelector(
  container,
  (state) => state.showGrid
);

export const selectActiveSecId = createSelector(
  container,
  (state) => state.activeSecId
);

export const selectSeatCandidates = createSelector(
  container,
  (state) => state.seatCandidates
);

export const selectChangedSeatsQty = createSelector(
  container,
  (state) => state.changedSeatsQty
);

export const selectActiveSgrId = createSelector(
  container,
  (state) => state.activeSgrId
);

export const selectCursorActive = createSelector(
  container,
  (state) => state.cursorActive
);

export const selectCursor = createSelector(container, (state) => state.cursor);

export const getSelectedShapeIDs = createSelector(
  container,
  (state) => state.selectedShapeIDs
);

export const SHAPE_FRAGMENT = gql`
  fragment Shape on Shape {
    x
    y
    w
    h
    r
    family
    stroke
    fill
    name
    updated_at
    id
  }
`;

export const SEAT_FRAGMENT = gql`
  fragment Seat on Seat {
    id
    x
    y
    num
    fmt_positions {
      id
      lb
      num
    }
    status_code
    seat_group_id
    price_id
    order_id
    split_order_id
  }
`;

export const SEAT_STACK_FRAGMENT = gql`
  fragment SeatStack on SeatStack {
    id
    x
    y
    status_code
    price_id
    qty
  }
`;

export const SHAPE_STATUS_FRAGMENT = gql`
  fragment ShapeStatus on Shape {
    x
    y
    w
    h
    r
    family
    stroke
    fill
    name
    id
    updated_at
    isSelected
  }
`;

export const CREATE_SHAPE = gql`
  mutation CreateShape(
    $dim: [Int]
    $location: [Int]
    $name: String
    $event_id: ID!
    $shape: String
  ) {
    createShape(
      input: { dim: $dim, location: $location, name: $name, shape: $shape }
      event_id: $event_id
    ) {
      ...Shape
    }
  }
  ${SHAPE_FRAGMENT}
`;

export const CREATE_SEATING_PLAN = gql`
  mutation CreateSeatingPlan($input: SeatingPlanInput!) {
    CreateSeatingPlan(input: $input) {
      id
      seating_plan {
        id
        name
      }
    }
  }
`;

export const CREATE_SEATS = gql`
  mutation CreateSeats($input: SeatsInput!) {
    CreateSeats(input: $input) {
      ...Seat
    }
  }
  ${SEAT_FRAGMENT}
`;

export const UPDATE_SEATS = gql`
  mutation UpdateSeats($input: SeatsInput!) {
    UpdateSeats(input: $input) {
      ...Seat
    }
  }
  ${SEAT_FRAGMENT}
`;

export const DELETE_SEATS = gql`
  mutation DeleteSeats($seat_ids: [ID!]!, $seating_plan_id: ID!) {
    DeleteSeats(seat_ids: $seat_ids, seating_plan_id: $seating_plan_id) {
      ok
    }
  }
`;

export const SETUP_SPL_SEATS = gql`
  mutation setupSplSeats(
    $event_id: ID
    $event_id: ID
    $rows: Int
    $seats: Int
  ) {
    setupSplSeats(
      event_id: $event_id
      event_id: $event_id
      rows: $rows
      seats: $seats
    ) {
      id
      event_id
    }
  }
`;

export const assignPriceToActiveSeats = async (
  splId: string,
  priceId: string,
  seatIds: [string]
) => {
  const client: any = getApolloClient();
  const seats = seatIds.map((seatID: string) => {
    const seat: ISeat = client.cache.data.data[`Seat:${seatID}`];
    seat.price_id = priceId;
    return pick(seat, "x", "y", "num", "id", "seat_group_id", "price_id");
  });
  const input = {
    seats,
    seating_plan_id: splId,
  };
  const { data } = await client.mutate({
    mutation: UPDATE_SEATS,
    variables: { input },
  });
  if (data && data.UpdateSeats) {
    data.UpdateSeats.forEach((seat: ISeat) => {
      // const svgSeat = d3Select(`#${seat.id}`);
      // if (svgSeat.attr("price-id")) {
      //   svgSeat.classed(svgSeat.attr("price-id"), false);
      // }
      // svgSeat.attr("price-id", priceId);
      // svgSeat.attr("price-id", priceId).classed(priceId, true);
      client.writeFragment({
        id: `Seat:${seat.id}`,
        fragment: SEAT_FRAGMENT,
        data: seat,
      });
    });
  }
};

// -------------------------------------------------------- sagas
const updateShapeStatusFragment = (id: string, data: any) => {
  const client: any = getApolloClient();
  client.writeFragment({
    id: `Shape:${id}`,
    fragment: SHAPE_STATUS_FRAGMENT,
    data,
  });
};

function* ajaxGetActivitiesByFilter({
  toggleShapeIDs,
}: ReturnType<typeof toggleSelectedShapes>) {
  const selectedShapeIDs: string[] = yield select(getSelectedShapeIDs);

  const selShapeIDs: string[] = selectedShapeIDs;
  // if (toggleShapeIDs.length < 1 || isEmpty(toggleShapeIDs[0])) return

  if (isEmpty(toggleShapeIDs)) {
    selectedShapeIDs.forEach((id: string) =>
      updateShapeStatusFragment(id, { isSelected: false })
    );
    return;
  }

  if (selShapeIDs.includes(toggleShapeIDs[0])) {
    updateShapeStatusFragment(toggleShapeIDs[0], { isSelected: false });
    return;
  }

  updateShapeStatusFragment(toggleShapeIDs[0], { isSelected: true });
}

export const sagas = function* () {
  yield takeLatest(TOGGLE_SHAPES_SELECTED, ajaxGetActivitiesByFilter);
};
