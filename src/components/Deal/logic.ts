import gql from "graphql-tag";
import { IDeal } from "./interfaces";

export const buildDeal = (): IDeal => ({
  id: "",
  description: "",
  cr: 0,
  sf: 0,
  reseller_org_id: "",
});

export const CREATE_DEAL = gql`
  mutation CreateDeal($input: DealInput!, $reseller_org_id: ID!) {
    CreateDeal(reseller_org_id: $reseller_org_id, input: $input) {
      id
      description
      cr
      sf
      service_tax_rate
    }
  }
`;

export const UPDATE_DEAL = gql`
  mutation UpdateDeal($id: ID!, $input: DealInput!) {
    UpdateDeal(id: $id, input: $input) {
      id
      cr
      sf
      description
      service_tax_rate
    }
  }
`;

export const FETCH_DEAL_BY_ID = gql`
  query fetchDealById($id: ID!) {
    deal(id: $id) {
      id
      description
      service_tax_rate
      reseller_org_id
      cr
      sf
    }
  }
`;

export const FETCH_EVENT_DEALS = gql`
  query fetchEventDeals($id: ID!) {
    event_deals(event_id: $id) {
      id
      description
      service_tax_rate
      reseller_org_id
      cr
      sf
    }
  }
`;

export const FETCH_DEALS = gql`
  query fetchDeals {
    deals {
      id
      description
      cr
      sf
      reseller_org_id
    }
  }
`;
