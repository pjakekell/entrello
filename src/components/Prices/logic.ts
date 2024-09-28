import gql from "graphql-tag";
import { IPrice } from "./interfaces";
import { priceColors } from "../../utils/colors";

export const buildPrice = (
  eventID: string | undefined,
  parentID: string | undefined = undefined,
  taxGroupID: string | undefined = undefined
): IPrice => ({
  id: "",
  event_id: eventID,
  parent_id: parentID,
  name: "",
  value: 0,
  color: priceColors[0],
  tax_group_id: taxGroupID,
  tax_group_name: "",
});

export const CREATE_PRICE = gql`
  mutation CreatePrice($input: PriceInput!) {
    CreatePrice(input: $input) {
      id
      price_name {
        name
      }
      value
    }
  }
`;

export const DELETE_PRICE = gql`
  mutation DeletePrice($id: ID!) {
    DeletePrice(id: $id) {
      ok
    }
  }
`;

export const UPDATE_PRICE = gql`
  mutation UpdatePrice($id: ID!, $input: UpdatePriceInput!) {
    UpdatePrice(id: $id, input: $input) {
      id
      pos
      value
      price_name {
        name
      }
    }
  }
`;

export const FETCH_PRICE_BY_ID = gql`
  query fetchPriceById($id: ID!) {
    price(id: $id) {
      id
      price_name {
        name
      }
      pos
      event_id
      deleted_at
    }
  }
`;

export const FETCH_PRICES_BY_EVENT_ID = gql`
  query fetchPrices($event_id: ID!) {
    prices(event_id: $event_id) {
      id
      price_name {
        name
      }
      pos
      event_id
      value
    }
  }
`;

export const FETCH_PRICES_BY_PARENT_ID = gql`
  query fetchPrices($parent_id: ID!) {
    prices(parent_id: $parent_id) {
      id
      price_name {
        name
      }
      event_id
      pos
      value
    }
  }
`;

export const FETCH_EVENT_DEALS_BY_PRICE_ID = gql`
  query fetchEventDealsByPriceId($price_id: ID!) {
    prices(price_id: $price_id) {
      id
      reseller_name
    }
  }
`;
