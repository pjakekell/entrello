import gql from "graphql-tag";

import { SEAT_STACK_FRAGMENT, SEAT_FRAGMENT } from "../Spl/logic";

export const EVENT_STATUS_CLOSED = 0b0;
export const EVENT_STATUS_ON_SALE = 0b1;
export const EVENT_STATUS_PUBLISHED = 0b1 << 1;
export const EVENT_STATUS_MOVED = 0b1 << 2;
export const EVENT_STATUS_FORCE_SOLD_OUT = 0b1 << 3;
export const EVENT_STATUS_CANCELLED = 0b1 << 4;
export const EVENT_STATUS_WAITING_ROOM = 0b1 << 5;

export const EVENT_FEATURE_SPL = 0b1;
export const EVENT_FEATURE_ACCEPT_VOUCHERS = 0b1 << 1;
export const EVENT_FEATURE_ONLINE_EVENT = 0b1 << 2;
export const EVENT_FEATURE_SHOP_NO_SPL = 0b1 << 3;
export const EVENT_FEATURE_SHOP_NO_BESTSEAT = 0b1 << 4;
export const EVENT_FEATURE_SHOP_RES = 0b1 << 5;
export const EVENT_FEATURE_SHOP_WAITING_ROOM = 0b1 << 6;
export const EVENT_FEATURE_SHOP_WAITING_LIST = 0b1 << 7;
export const EVENT_FEATURE_PROMO_CODES = 0b1 << 8;
export const EVENT_FEATURE_ALL_DAY = 0b1 << 9;
export const EVENT_FEATURE_PRODUCTS = 0b1 << 10;

export const EVENT_RULE_FORCE_FULL_GROUP = 0b1;
export const EVENT_RULE_NO_SINGLE_SEAT_GAP = 0b1 << 1;

export function getBitsFrom(binaryNum: number, position: number) {
  // Bit-shifts according to zero-indexed position
  const mask = 1 << position;
  const query = binaryNum & mask;
  return Boolean(query);
}

export const buildStartsAt = (daysApart: number = 1) => {
  let startsAt = new Date();
  startsAt.setDate(startsAt.getDate() + daysApart);
  startsAt.setHours(20);
  startsAt.setMinutes(0);
  startsAt.setSeconds(0);
  startsAt.setUTCMilliseconds(0);
  return startsAt;
};

export const buildEvent = (): any => {
  return {
    id: "",
    title: "",
    subtitle: "",
    starts_at: null,
    // startsAt,
    static_total: 10,
  };
};

export const EVENT_FRAGMENT_BY_ID = gql`
  fragment EventById on Event {
    id
    status_code
    features
    static_total
    seating_plan {
      id
    }
  }
`;

export const EVENT_FRAGMENT = gql`
  fragment Event on Event {
    id
    sync_id
    title
    subtitle
    starts_at
    status_code
    features
    location_id
    labels
    totals {
      claimed
      total
      booked
    }
  }
`;

export const EVENT_SETTINGS_FRAGMENT = gql`
  fragment EventSettings on Event {
    id
    settings {
      close_sale_min_before_starts_at
      hold_claims_min
      close_sale_booking_perc
      qty_preselected_tickets
      max_qty_tickets 
    }
  }
`;

export const FULL_EVENT_FRAGMENT = gql`
  fragment FullEvent on Event {
    id
    sync_id
    title
    subtitle
    description
    static_total
    starts_at
    status_code
    sync_id
    location_id
    media_web_bg_urls
    features
    totals {
      total
      booked
      claimed
      revenue
      revenue_paid
      paid
    }
    prices {
      id
      price_name {
        name
      }
    }
    seating_plan {
      id
      name
      width
      height
      seats {
        ...Seat
      }
      stacks {
        ...SeatStack
      }
    }
  }
`;

export const FETCH_EVENTS = gql`
  query fetchEvents($query: String, $from: Int) {
    events(query: $query, from: $from) {
      ...Event
    }
  }
  ${EVENT_FRAGMENT}
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    UpdateEvent(id: $id, input: $input) {
      ...Event
    }
  }
  ${EVENT_FRAGMENT}
`;

export const UPDATE_EVENT_STATUS = gql`
  mutation UpdateEventStatus($id: ID!, $status_code: Int!) {
    UpdateEventStatus(id: $id, status_code: $status_code) {
      ok
    }
  }
`;

export const UPDATE_EVENT_SETTINGS = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    UpdateEvent(id: $id, input: $input) {
      ...EventSettings
    }
  }
  ${EVENT_SETTINGS_FRAGMENT}
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: EventInput!) {
    CreateEvent(input: $input) {
      ...Event
    }
  }
  ${EVENT_FRAGMENT}
`;

export const GET_EVENT_BY_ID = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      status_code
    }
  }
`;

export const FETCH_EVENT_BY_ID = gql`
  query FullEventWithSeatingPlan($id: ID!) {
    event(id: $id) {
      ...FullEvent
    }
  }
  ${FULL_EVENT_FRAGMENT}
  ${SEAT_FRAGMENT}
  ${SEAT_STACK_FRAGMENT}
`;

export const FETCH_EVENTS_BY_SYNC_ID = gql`
  query Events($sync_id: ID) {
    events(sync_id: $sync_id, sort: "starts_at") {
      id
      title
      starts_at
      status_code
    }
  }
`;
