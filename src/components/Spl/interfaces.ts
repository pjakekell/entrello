export type ICoords = [number, number];

export interface ISeatingPlan {
  id: string;
  name: string;
  width: number;
  height: number;
  seats: ISeat[];
}

export interface IFPosItem {
  id: string;
  lb: string;
  num: string;
}

export interface ISeat {
  id?: string;
  x: number;
  y: number;
  duplicate?: boolean;
  fmt_positions?: IFPosItem[];
  seat_group_id: string | null;
  status_code: number;
  num: number | null;
  price_id?: string | null;
  updated_at?: Date;
  order_id?: string | null;
  split_order_id?: string | null;
}

export interface ISeatGroup {
  id: string;
  name: string;
  num?: string;
  pos?: number;
  parent_id: string | null;
}

export interface IFixture {
  id: string;
  dim: ICoords;
  location: ICoords;
  name?: string;
  updated_at: Date;
}

export interface ILayer {
  id: string;
  name?: string;
  updated_at: Date;
}

export interface ISection {
  id: string;
  name: string;
  num: string;
  updated_at: Date;
}

export interface IRowConfig {
  name: string;
  num: string;
  qty: number;
}

export interface ISecPlacement {
  section_id: string;
  rows_config: IRowConfig[];
  v_rows_arrangement: boolean;
  seats?: ISeat[];
}
