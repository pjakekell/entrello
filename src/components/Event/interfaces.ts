import { IPrice } from "../Prices/interfaces";
import { ISeatingPlan } from "../Spl/interfaces";

export interface IEventTotals {
  total: number;
  booked: number;
  paid: number;
  revenue: number;
  revenue_paid: number;
  claimed: number;
}

export interface IEvent {
  id: string;
  title: string;
  subtitle: string;
  totals: IEventTotals;
  static_total: number;
  features: number;
  status_code: number;
  starts_at: Date;
  prices?: IPrice[];
  sync_id?: string;
  location_id?: string;
  seating_plan?: ISeatingPlan;
  use_spl: boolean;
}

export interface IEventDeal {
  id: string;
  event_id: string;
  deal_id: string;
  reseller_org_id: string;
  tickets_limit?: number;
  price_ids: string[];
}
