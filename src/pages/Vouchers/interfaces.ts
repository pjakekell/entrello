import { IContact } from "../../components/Contact/interfaces";
import { IOrder } from "../../components/Orders/interfaces";

export interface IVoucher {
  __typename?: string;
  id?: string;
  value: number;
  original_value?: number;
  order?: IOrder | null;
  order_id?: string | null;
  code?: string;
  dedication: string;
  contact: IContact;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
