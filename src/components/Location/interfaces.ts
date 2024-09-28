export interface ILocation {
  id: string;
  name: string;
  street: string;
  postcode: string;
  city: string;
  country: string;
  email: string;
  phone: string;
}

export interface ILocationTypes {
  id?: string;
  name: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
    coords: {
      lat: number;
      lng: number;
    }
  }
}

export interface ILocationOptions {
  label: string;
  x: number;
  y: number;
}

export interface IlocationOptionSelected {
  label: string,
  value: string,
  lat: number,
  lng: number
}