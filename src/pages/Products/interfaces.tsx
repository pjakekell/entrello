export interface IPrices {
  id?: string;
  name: string;
  value: number;
  tax_group_id: string;
}
export interface IProduct {
  __typename?: string;
  category: string;
  created_at?: Date | null;
  description: string;
  id?: string;
  name: string;
  unit: string;
  pos: number;
  num: string;
  price_id?: string;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  prices?: IPrices[];
  priceValue: number;
  tax_group_id: string;
  priceName: string;
  priceId: string;
  total_qty: number;
  tax_group_name?: string;
}
