export interface IDeal {
  id: string;
  description: string;
  cr: number;
  sf: number;
  reseller_org_id: string;
  service_tax_rate?: number;
}
