import { gql } from "@apollo/react-hooks";
import { priceColors } from "../../../utils/colors";

export interface IPriceCategory {
    id: string;
    name: string;
    description: string;
    color: string;
}
export const buildPriceCategory = (priceCategoryData: IPriceCategory) => {
    if (priceCategoryData) {
        const { id, name, description, color } = priceCategoryData;
        return {
            id,
            name,
            description,
            color
        }
    }
    return {
        id: "",
        name: "",
        description: "",
        color: priceColors[0],
    }
}


export const CREATE_PRICE_CATEGORY = gql`
    mutation CreatePriceCategory($input: PriceCategoryInput!) {
        CreatePriceCategory(input: $input) {   
            id
            name
            description
            color
            org_id
            created_at
            created_by
        }
    }
`

export const UPDATE_PRICE_CATEGORY = gql`
    mutation UpdatePriceCategory($id: ID!, $input: PriceCategoryInput!) {
        UpdatePriceCategory(id: $id, input: $input) {   
            id
            name
            description
            org_id
            color
            created_at
            created_by
        }
    }
`

export const FETCH_PRICE_CATEGORIES = gql`
    query PriceCategories($query: String) {
        price_categories(query: $query) {   
            id
            name
            description
            color
            org_id
            created_at
            created_by
            updated_at
            updated_by
        }
    }
`

export const FETCH_PRICE_CATEGORY_BY_ID = gql`
    query PriceCategory($id: ID!) {
        price_category(id: $id) {   
            id
            name
            description
            color
            org_id
            created_at
            created_by
            updated_at
            updated_by
        }
    }
`

export const DELETE_PRICE_CATEGORY = gql`
    mutation DeletePriceCategory($id: ID!) {
        DeletePriceCategory(id: $id) {
            ok
        }
    }
`