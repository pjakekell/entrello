import gql from "graphql-tag";
import { IProduct } from "./interfaces";
import isEmpty from "lodash/isEmpty";
import { ITaxGroup } from "../../components/TaxGroup/interfaces";
import { isNil } from "lodash";
export const buildProduct = (
  product: IProduct,
  total_qty: number,
  taxGroups: ITaxGroup[]
): IProduct => {
  let productCopy = { ...product };
  if (productCopy && productCopy.prices && productCopy.prices.length > 0) {
    const productPriceObject =
      productCopy.prices[productCopy.prices.length - 1];
    productCopy.priceValue = productPriceObject.value;
    productCopy.tax_group_id = productPriceObject.tax_group_id;
    productCopy.priceName = productPriceObject.name;
    productCopy.total_qty = total_qty ? total_qty : 0;
    // if (taxGroups) {
    //     productCopy.tax_group_name = taxGroups.find(taxGroup => taxGroup.id === productPriceObject.tax_group_id)?.name
    // }

    if (productPriceObject.id) productCopy.priceId = productPriceObject.id;
  }
  return !isEmpty(productCopy)
    ? productCopy
    : {
        category: "",
        description: "",
        name: "",
        pos: 0,
        unit: "",
        num: "",
        priceValue: 0,
        tax_group_id: isNil(taxGroups) ? "" : taxGroups[0].id,
        priceName: "",
        priceId: "",
        total_qty: 0,
        tax_group_name: "",
      };
};

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    CreateProduct(input: $input) {
      id
      price_id
      name
      category
      description
      pos
      unit
      num
      created_at
      updated_at
      deleted_at
    }
  }
`;

export const FETCH_PRODUCTS = gql`
  query Products($limit: Int, $offset: Int, $query: String) {
    products(limit: $limit, offset: $offset, query: $query) {
      id
      price_id
      name
      category
      description
      pos
      unit
      num
      created_at
      updated_at
      deleted_at
      prices {
        id
        name
        value
        tax_group_id
      }
    }
  }
`;

export const FETCH_PRODUCT_BY_ID = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      price_id
      name
      num
      category
      description
      pos
      unit
      created_at
      updated_at
      deleted_at
      prices {
        id
        name
        value
        tax_group_id
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    UpdateProduct(id: $id, input: $input) {
      id
      name
      category
      description
      pos
      unit
      num
      created_at
      updated_at
      deleted_at
      prices {
        id
        name
        value
        tax_group_id
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    DeleteProduct(id: $id) {
      ok
    }
  }
`;

export const CREATE_PRODUCT_PRICE = gql`
  mutation CreateProductPrice($input: ProductPriceInput!) {
    CreateProductPrice(input: $input) {
      id
      name
      value
      tax_group_id
    }
  }
`;

export const UPDATE_PRODUCT_PRICE = gql`
  mutation UpdateProductPrice($id: ID!, $input: UpdateProductPriceInput!) {
    UpdateProductPrice(id: $id, input: $input) {
      id
      name
      color
      value
      created_at
      updated_at
      deleted_at
      tax_group_id
    }
  }
`;

export const FETCH_PRODUCT_CAPACITY = gql`
  query ProductCapacity($product_id: ID!) {
    product_capacity(product_id: $product_id) {
      total_qty
    }
  }
`;

export const EDIT_PRODUCT_CAPACITY = gql`
  mutation AddProductCapacity($input: ProductCapacityInput!) {
    AddProductCapacity(input: $input) {
      product_id
      total_qty
    }
  }
`;
