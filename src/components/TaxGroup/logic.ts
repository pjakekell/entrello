import gql from "graphql-tag";
import { ITaxGroup } from "./interfaces";

export const buildTaxGroup = (): ITaxGroup => ({
  id: "",
  name: "",
});

export const CREATE_TAX_GROUP = gql`
  mutation CreateTaxGroup($name: String!, $tax_rate: Float!) {
    CreateTaxGroup(input: { name: $name, tax_rate: $tax_rate }) {
      id
      name
      tax_rate
    }
  }
`;

export const UPDATE_TAX_GROUP = gql`
  mutation UpdateTaxGroup($name: String!, $tax_rate: Float!, $id: ID!) {
    UpdateTaxGroup(id: $id, input: { name: $name, tax_rate: $tax_rate }) {
      id
      name
      tax_rate
    }
  }
`;

export const FETCH_TAX_GROUP_BY_ID = gql`
  query fetchTaxGroupById($id: ID!) {
    tax_group(id: $id) {
      id
      name
      tax_rate
    }
  }
`;

export const FETCH_TAX_GROUPS = gql`
  query fetchTaxGroups {
    tax_groups {
      id
      name
      tax_rate
    }
  }
`;

export const DELETE_TAX_GROUP = gql`
  mutation DeleteTaxGroup($id: ID!) {
    DeleteTaxGroup(id: $id) {
        ok
    }
  }
`
