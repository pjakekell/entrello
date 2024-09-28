export interface IAddress {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  street?: string;
  street2?: string;
  postcode?: string;
  city?: string;
  country?: string;
}

export interface ICompany {
  id?: string;
  name?: string;
  hid?: string;
  uid?: string;
  cnum?: string;
  addr?: IAddress;
}

export interface IContact {
  id?: string;
  company: ICompany;
  name?: string;
  annotation?: string;
  firstname?: string;
  lastname?: string;
  addr?: IAddress;
  email?: string;
  phone?: string;
}
