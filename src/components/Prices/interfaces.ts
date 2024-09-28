export interface IPrice {
  id: string;
  name: string;
  value: number;
  pos?: number;
  tax_group_name: string;
  tax_group_id?: string;
  concessions?: [IPrice];
  parent_id?: string;
  event_id?: string;
  color: string;
  deleted_at?: Date;
}
