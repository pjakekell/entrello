import { IContact } from "../Contact/interfaces";

export interface IGroupedItem {
  qty: number;
  product_name: string;
  product_id: string;
  event_id: string;
  tax: number;
  intrinsic_total: number;
  seat_ids: [];
  price_id: string;
  price_name: string;
  price_value: number;
  spl_seats: boolean;
  total: number;
  title: string;
  subtitle: string;
}

export interface IOrderItem {
  id?: string;
  qty: number;
  title?: string;
  subtitle?: string;
  deleted?: IByAt;
  desc?: string;
  markDeleted?: boolean;
  event_id?: string;
  price_id?: string;
  seat_id?: string;
  product_id?: string;
  voucher_id?: string;
  static_price?: number;
  static_taxes?: number;
  static_fees?: number;
  static_rate?: number;
}

export interface IPayItem {
  id: string | null;
  payment_method: number;
  paid_at: Date;
  total: number;
}

export interface IByAt {
  by: string;
  at: number;
}

export interface IOrderLog {
  at: number;
  by_name: string;
  by_id: string;
  action: string;
  message: string;
  created_at: string;
  action_code: number;
}

export interface IOrder {
  id: string;
  split_order_id?: string | null;
  split_order_booking_code?: string | null;
  deleted_at: Date;
  title: string;
  subtitle: string;
  expires_at: Date;
  status_code: number;
  order_type: string;
  event_id: string;
  booking_code: string;
  annotation: string;
  created: number;
  contact: IContact;
  invoiced_total: number;
  intrinsic_total: number;
  total: number;
  qty: number;
  grouped_items: IGroupedItem[];
  order_items: IOrderItem[];
  pay_items: IPayItem[];
  reseller_rid: string;
  logs: IOrderLog[];
  contact_id: string;
  created_at: Date;
}
