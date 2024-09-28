import gql from "graphql-tag";
import { IOrder } from "./interfaces";
import {
  SEAT_STATUS_AVAILABLE,
  SEAT_STATUS_BOOKED,
  SEAT_STATUS_CLAIMED,
  SEAT_STATUS_PAID,
} from "../Spl/logic";
import { CONTACT_FRAGMENT } from "../Contact/logic";
import messages from "../../i18n/messages";
import * as Request from "../../rest-api";

export const ORDER_STATUS_CREATED = 0b0;
export const ORDER_STATUS_CLAIMED = 0b1;
export const ORDER_STATUS_BOOKED = 0b1 << 1;
export const ORDER_STATUS_PENDING = 0b1 << 2;
export const ORDER_STATUS_INVOICED = 0b1 << 3;
export const ORDER_STATUS_PAID = 0b1 << 4;
export const ORDER_STATUS_PARTIALLY_REFUNDED = 0b1 << 5;
export const ORDER_STATUS_FULLY_REFUNDED = 0b1 << 6;
export const ORDER_STATUS_EXPIRED = 0b1 << 7;
export const ORDER_STATUS_DELETED = 0b1 << 8;

export const ORDER_MORE_STATUS: any = {
  succeeded: 0b1,
  incomplete: 0b1 << 1,
  uncaptured: 0b1 << 2,
  disputed: 0b1 << 3,
  pending: 0b1 << 4,
  refunded: 0b1 << 5,
  refundPending: 0b1 << 6,
  partialRefunded: 0b1 << 7,
  failed: 0b1 << 8,
  canceled: 0b1 << 9,
  earlyFraudWarning: 0b1 << 10,
};

export const TIMEZONE_GMT = 101;
export const TIMEZONE_UTC = 102;

export const ORDER_TYPE_REGULAR = "REGULAR";
export const ORDER_TYPE_RESERVATION = "RESERVATION";
export const ORDER_TYPE_OPTION = "OPTION";
export const ORDER_TYPE_OPTION_OR_RESERVATION = "OPTION_OR_RESERVATION";

export const PAYMENT_METHOD_CASH = 101;
export const PAYMENT_METHOD_TERM_CARD = 102;
export const PAYMENT_METHOD_BANK_TRANSFER = 210;
export const PAYMENT_METHOD_VOUCHER = 206;
export const PAYMENT_METHOD_STRIPE_CARD = 402;
export const PAYMENT_METHOD_STRIPE_SOFORT = 410;
export const PAYMENT_METHOD_STRIPE_EPS = 411;
export const PAYMENT_METHOD_STRIPE_GIRO = 412;
export const PAYMENT_METHOD_STRIPE_MOTO = 420;

export const PAGINATION_LIMIT = 20;

export const SPLIT_ORDER = "SPLIT_ORDER";
export const NEW_ORDER = "NEW_ORDER";

export const PaymentMethodsByString: any = {
  cash: PAYMENT_METHOD_CASH,
  term_card: PAYMENT_METHOD_TERM_CARD,
  voucher: PAYMENT_METHOD_VOUCHER,
};

interface II18nMsg {
  id: string;
  defaultMessage: string;
}

interface IStatusCode {
  claimed: II18nMsg | null;
  booked: II18nMsg | null;
  pending: II18nMsg | null;
  invoiced: II18nMsg | null;
  paid: II18nMsg | null;
  refunded: II18nMsg | null;
  deleted: II18nMsg | null;
  partially_refunded: II18nMsg | null;
  invalid: II18nMsg | null;
}

const orderSeatConversionTable: any = {
  [ORDER_STATUS_CLAIMED]: SEAT_STATUS_CLAIMED,
  [ORDER_STATUS_BOOKED]: SEAT_STATUS_BOOKED,
  [ORDER_STATUS_PAID]: SEAT_STATUS_PAID,
  [ORDER_STATUS_EXPIRED]: SEAT_STATUS_AVAILABLE,
  [ORDER_STATUS_DELETED]: SEAT_STATUS_AVAILABLE,
};

export const convertOrderStatus2SeatStatus = (status: number) => {
  return orderSeatConversionTable[status];
};

export const getOrderStatus = (order: IOrder): IStatusCode => {
  const status: IStatusCode = {
    claimed: null,
    booked: null,
    pending: null,
    invoiced: null,
    paid: null,
    refunded: null,
    deleted: null,
    partially_refunded: null,
    invalid: messages.invalid,
  };
  if ((order.status_code & ORDER_STATUS_CLAIMED) > 0) {
    status.claimed = messages.claimed;
  }
  if ((order.status_code & ORDER_STATUS_BOOKED) > 0) {
    status.booked = messages.booked;
  }
  if ((order.status_code & ORDER_STATUS_PAID) > 0) {
    status.paid = messages.paid;
  }
  if ((order.status_code & ORDER_STATUS_DELETED) > 0) {
    status.deleted = messages.deleted;
  }
  return status;
};

export const ORDER_ITEM_FRAGMENT = gql`
  fragment OrderItem on OrderItem {
    id
    seat_id
    event_id
    product_id
    voucher_id
    price_id
    qty
    static_price
    static_tax
    static_rate
    title
    subtitle
    deleted_at
    deal_id
  }
`;

export const ORDER_UPDATE_ITEM_FRAGMENT = gql`
  fragment OrderPriceItem on Order {
    id
    order_items {
      id
      qty
      price_id
    }
  }
`;

export const ORDER_FRAGMENT = gql`
  fragment Order on Order {
    id
    annotation
    title
    subtitle
    contact {
      ...Contact
    }
    qty
    total
    expires_at
    created_at
    booking_code
    status_code
    order_type
    reseller_id
    split_order_id
    deleted_at
    deleted_by_id
  }
  ${CONTACT_FRAGMENT}
`;

export const ORDER_FILTER_FRAGMENT = gql`
  fragment FilterOrder on Order {
    id
    booking_code
    qty
    total
    order_type
    status_code
    contact {
      firstname
    }
    created_at
    order_items {
      id
      title
      subtitle
    }
  }
`;

export const FULL_ORDER_FRAGMENT = gql`
  fragment FullOrder on Order {
    id
    title
    subtitle
    annotation
    expires_at
    deleted_at
    split_orders {
      id
      booking_code
      status_code
      total
      qty
    }
    split_order_id
    split_order_booking_code
    contact {
      id
      name
      email
      phone
      addr {
        street
        city
        postcode
        country
        email
        phone
      }
    }
    booking_code
    status_code
    order_type
    qty
    total
    shipping {
      provider {
        name
      }
      total
      tax
      estimated_date
      shipped_at
    }
    order_items {
      ...OrderItem
    }
    logs {
      action_code
      message
      created_at
      by_id
    }
    grouped_items {
      qty
      product_name
      product_id
      price_id
      event_id
      tax
      intrinsic_total
      seat_ids
      price_name
      price_value
      total
      spl_seats
    }
    pay_items {
      id
      payment_method
      paid_at
      total
    }
    reseller_rid
    reseller_id
    created_at
  }
  ${ORDER_ITEM_FRAGMENT}
`;

export const SPLIT_ORDER_FRAGMENT = gql`
  fragment SplitOrder on Order {
    id
    booking_code
    expires_at
    reseller_id
    split_order_id
    split_orders {
      id
      booking_code
      qty
      order_items {
        event_id
      }
    }
    grouped_items {
      price_id
      event_id
      qty
      total
      tax
      intrinsic_total
      seat_ids
      spl_seats
      price_name
      price_value
    }
    contact {
      email
    }
    order_items {
      id
      qty
      title
      subtitle
      seat_id
      event_id
      price_id
      deal_id
      static_price
      static_tax
      seat_info {
        name
        num
      }
    }
    pay_items {
      id
      payment_method
      total
    }
    logs {
      created_at
      message
      action_code
    }  
  }
`;

export const ORDERS_SUBSCRIPTION = gql`
  subscription OrderChanged($token: String!) {
    orderChanged(token: $token) {
      id
      status_code
      order_items {
        seat_id
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($items: [OrderItemInput!]!) {
    CreateOrder(items: $items) {
      ...FullOrder
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const CREATE_SPLIT_ORDER = gql`
  mutation CreateSplitOrder($items: [OrderItemInput!]!, $split_order_id: ID) {
    CreateOrder(items: $items, split_order_id: $split_order_id) {
      ...FullOrder
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const CREATE_PAY_ITEM = gql`
  mutation CreatePayItem($input: CreatePayItemInput!) {
    CreatePayItem(input: $input) {
      id
      total
      payment_method
    }
  }
`;

export const DELETE_PAY_ITEM = gql`
  mutation DeletePayItem($id: ID!) {
    DeletePayItem(id: $id) {
      ok
    }
  }
`;

export const CREATE_INVOICE = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    CreateInvoice(input: $input) {
      id
      total
      num
    }
  }
`;

export const UPDATE_ORDER_ITEM = gql`
  mutation UpdateOrderItem($id: ID!, $order_id: ID!, $input: OrderItemInput!) {
    UpdateOrderItem(id: $id, order_id: $order_id, input: $input) {
      ...OrderPriceItem
    }
  }
  ${ORDER_UPDATE_ITEM_FRAGMENT}
`;

export const FETCH_ORDERS = gql`
  query Orders($limit: Int, $sort: String, $desc: Boolean, $event_ids: [ID!]) {
    orders(limit: $limit, sort: $sort, desc: $desc, event_ids: $event_ids) {
      ...Order
    }
  }
  ${ORDER_FRAGMENT}
`;

export const FETCH_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
      ...FullOrder
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const UPDATE_ORDER = gql`
  mutation updateOrder($id: ID!, $input: UpdateOrderInput!) {
    UpdateOrder(id: $id, input: $input) {
      ...FullOrder
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const DELETE_ORDER = gql`
  mutation deleteOrder($id: ID!) {
    DeleteOrder(id: $id) {
      ok
    }
  }
`;

export const DELETE_ORDER_ITEM = gql`
  mutation DeleteOrderItems($order_id: ID!, $item_ids: [ID!]!) {
    DeleteOrderItems(order_id: $order_id, item_ids: $item_ids) {
      id
      booking_code
      expires_at
      order_items {
        id
        qty
        title
        subtitle
        seat_id
        event_id
        price_id
        deal_id
        static_price
        static_tax
      }
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation updateOrderStatus($id: ID!, $status_code: Int!) {
    UpdateOrderStatus(id: $id, status_code: $status_code) {
      ...FullOrder
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const FETCH_CONTINGENTS_BY_EVENT_ID = gql`
  query Orders($event_id: ID!) {
    orders(event_ids: [$event_id], order_type: "OPTION") {
      ...Order
    }
  }
  ${ORDER_FRAGMENT}
`;

export const FETCH_ORDERS_BY_FILTER = gql`
  query GetOrders(
    $query: String
    $status_code: Int
    $order_type: String
    $event_ids: [ID!]
    $limit: Int
    $offset: Int
  ) {
    orders(
      query: $query
      status_code: $status_code
      order_type: $order_type
      event_ids: $event_ids
      limit: $limit
      offset: $offset
    ) {
      ...Order
    }
  }
  ${ORDER_FRAGMENT}
`;

export const FETCH_SPLIT_ORDER_BY_ID = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      ...SplitOrder
    }
  }
  ${SPLIT_ORDER_FRAGMENT}
`;

export const exportOrdersAsCSV = async (params: any) => {
  const response = await Request.GET(
    `/orders/${Request.getToken()}/export.csv`,
    params
  );
  return response.status === 200 ? response.body : null;
};

export const exportOrdersAsXLSX = async (params: any) => {
  const response = await Request.GET(
    `/orders/${Request.getToken()}/export.xlsx`,
    params
  );
  return response.status === 200 ? response.body : null;
};
