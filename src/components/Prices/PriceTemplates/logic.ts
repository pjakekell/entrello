import { gql } from "@apollo/react-hooks";

export interface IPriceTemplate {
  id: string;
  name: string;
  description: string;
}

export const buildPriceTemplate = (priceTemplateData: IPriceTemplate) => {
  if (priceTemplateData) {
    const { id, name, description } = priceTemplateData;
    return {
      id,
      name,
      description
    }
  }
  return {
    "id": "",
    "name": "",
    "description": ""
  }
}

export const FETCH_PRICE_TEMPLATES = gql`
  query PriceTemplates($query: String) {
    price_templates(query: $query) {   
      id
      name
      description
      org_id
      created_at
      created_by
      updated_at
      updated_by
    }
  }
`;

export const CREATE_PRICE_TEMPLATE = gql`
  mutation CreatePriceTemplate($input: PriceTemplateInput!) {
    CreatePriceTemplate(input: $input) {   
      id
      name
      description
      org_id
      created_at
      created_by
    }
  }
`

export const UPDATE_PRICE_TEMPLATE = gql`
    mutation UpdatePriceTemplate($id: ID!, $input: PriceTemplateInput!) {
      UpdatePriceTemplate(id: $id, input: $input) {   
        id
        name
        description
        org_id
        created_at
        created_by
      }
    }
`

export const FETCH_PRICE_TEMPLATE_BY_ID = gql`
  query PriceTemplate($id: ID!) {
    price_template(id: $id) {   
      id
      name
      description
      org_id
      created_at
      created_by
      updated_at
    }
  }
`;

export const DELETE_PRICE_TEMPLATE = gql`
  mutation DeletePriceTemplate($id: ID!) {
    DeletePriceTemplate(id: $id) {
      ok
    }
  }
`
