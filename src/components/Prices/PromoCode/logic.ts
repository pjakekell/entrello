import { gql } from "@apollo/react-hooks";

export interface IPromoCode {
  id: string;
  name: string;
  description: string;
  code: string;
  affiliate: string;
  price_name_id: string;
}

export const buildPromoCode = (promoCodeData: IPromoCode) => {
  if (promoCodeData) {
    const { id, name, description, code, affiliate, price_name_id } = promoCodeData;
    return {
      id,
      name,
      description,
      code,
      affiliate,
      price_name_id
    }
  }
  return {
    "id": "",
    "name": "",
    "description": "",
    "code": "",
    "affiliate": "",
    "price_name_id": ""
  }
}

export const FETCH_PROMO_CODES = gql`
  query PromoCodes($query: String) {
    promo_codes(query: $query) {   
      id
      name
      description
      code
      affiliate
      org_id
      price_name_id
      created_at
      created_by
      updated_at
      updated_by
    }
  }
`;

export const CREATE_PROMO_CODE = gql`
  mutation CreatePromoCode($input: PromoCodeInput!) {
    CreatePromoCode(input: $input) {   
      id
      name
      description
      code
      affiliate
      org_id
      price_name_id
      created_at
      created_by
    }
  }
`

export const UPDATE_PROMO_CODE = gql`
    mutation UpdatePromoCode($id: ID!, $input: UpdatePromoCodeInput!) {
      UpdatePromoCode(id: $id, input: $input) {   
        id
        name
        description
        org_id
        code
        affiliate
        created_at
        created_by
      }
    }
`

export const FETCH_PROMO_CODE_BY_ID = gql`
  query PromoCode($id: ID!) {
    promo_code(id: $id) {   
      id
      name
      description
      code
      affiliate
      org_id
      price_name_id
      created_at
      created_by
      updated_at
      updated_by
    }
  }
`;

export const DELETE_PROMO_CODE = gql`
  mutation DeletePomoCode($id: ID!) {
    DeletePromoCode(id: $id) {
      ok
    }
  }
`