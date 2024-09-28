export interface IOrg {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
  short_id: string;
  stripe_acc_id: string;
  features: number;
  accepted_payment_methods: number;
  media_logo_url?: string;
  media_web_bg_url?: string;
  media_ticket_bg_url?: string;
  media_voucher_bg_url?: string;
}

export interface IBankAccount {
  id: string;
  active: boolean;
  currency: string;
  iban: string;
  holder_name: string;
}
