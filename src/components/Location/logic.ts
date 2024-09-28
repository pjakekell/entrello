import gql from "graphql-tag";
import { ILocationTypes } from "./interfaces";

export function buildInitialValues(location?: ILocationTypes) {
  if (location) {
    const { name, address: { street, postcode, city, coords: { lat, lng }, country, email, phone } } = location;
    return {
      name,
      street,
      postcode,
      city,
      lat,
      lng,
      country,
      email,
      phone
    }
  }
  return {
    name: '',
    street: '',
    postcode: '',
    city: '',
    country: '',
    email: '',
    lat: 0,
    lng: 0,
    phone: ''
  }
}

export const buildLocation = ({
  country = "DE",
  city = "",
  postcode = "",
  street = "",
}) => ({
  id: "",
  name: "",
  street,
  city,
  postcode,
  country,
  phone: "",
  email: "",
});

const fragments = {
  Address: gql`
    fragment LocationAddress on Location {
      address {
        street
        city
        postcode
        country
        email
        phone
        coords {
          lat
          lng
        }
      }
    }
  `,
};

export const CREATE_LOCATION = gql`
  mutation CreateLocation($input: LocationInput!) {
    CreateLocation(input: $input) {
      id
      name
      ...LocationAddress
    }
  }
  ${fragments.Address}
`;

export const UPDATE_LOCATION = gql`
  mutation UpdateLocation($id: ID!, $input: LocationInput!) {
    UpdateLocation(id: $id, input: $input) {
      id
      name
      ...LocationAddress
    }
  }
  ${fragments.Address}
`;

export const DELETE_LOCATION = gql`
  mutation DeleteLocation($id: ID!) {
      DeleteLocation(id: $id) {
          ok
      }
  }
`;

export const FETCH_LOCATION_BY_ID = gql`
  query GetLocation($id: ID!) {
    location(id: $id) {
      id
      name
      ...LocationAddress
    }
  }
  ${fragments.Address}
`;

export const FETCH_LOCATIONS = gql`
  query fetchLocations($query: String) {
    locations(query: $query) {
      id
      name
      ...LocationAddress
    }
  }
  ${fragments.Address}
`;

