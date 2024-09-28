import { gql } from "@apollo/react-hooks";

export interface IPriceName {
  id: string;
  name: string;
  description: string;
  num: number;
  tax_group_id: string | null;
  tax_group_name?: string;
}

export const buildPriceName = (priceNameData: IPriceName, taxGroupId: string | null) => {
  if (priceNameData) {
    const { id, name, description, num, tax_group_id, tax_group_name } = priceNameData;
    return {
      id,
      name,
      description,
      num,
      tax_group_id,
      tax_group_name
    }
  }
  return {
    "id": "",
    "name": "",
    "description": "",
    "num": 0,
    "tax_group_id": taxGroupId,
  }
}

export const FETCH_PRICE_NAMES = gql`
  query PriceNames($query: String) {
    price_names(query: $query) {   
        id
        name
        description
        num
        org_id
        tax_group_id
        tax_group_name
        created_at
        created_by
        updated_at
        updated_by
    }
  }
`

export const CREATE_PRICE_NAME = gql`
    mutation CreatePriceName($input: PriceNameInput!) {
        CreatePriceName(input: $input) {   
            id
            name
            description
            num
            org_id
            tax_group_id
            tax_group_name
            created_at
            created_by
        }
    }
`

export const UPDATE_PRICE_NAME = gql`
    mutation UpdatePriceName($id: ID!, $input: UpdatePriceNameInput!) {
      UpdatePriceName(id: $id, input: $input) {   
          id
          name
          description
          num
          org_id
          tax_group_id
          tax_group_name
          created_at
          created_by
      }
    }
`

export const FETCH_PRICE_NAME_BY_ID = gql`
  query PriceName($id: ID!) {
      price_name(id: $id) {   
          id
          name
          description
          num
          org_id
          tax_group_id
          tax_group_name
          created_at
          updated_at
          deleted_at
      }
  }
`;

export const DELETE_PRICE_NAME = gql`
  mutation DeletePriceName($id: ID!) {
      DeletePriceName(id: $id) {
          ok
      }
  }
`