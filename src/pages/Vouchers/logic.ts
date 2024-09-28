import gql from "graphql-tag";
import { IVoucher } from "./interfaces";
import { buildContact } from "../../components/Contact/logic";

export const buildVoucher = (voucher: IVoucher): IVoucher => {
  return voucher
    ? voucher
    : {
        dedication: "",
        value: 0,
        contact: buildContact(),
      };
};

gql`
  scalar Timestamp
  type Empty {
    ok: Boolean!
  }

  input VoucherInput {
    value: Int!
    dedication: String
    contact_id: String
  }

  type Order {
    id: ID!
    booking_code: String!
    status_code: Int!
  }

  type Voucher {
    id: ID!
    value: Int!
    original_value: Int!
    booking_code: String!
    status_code: Int!
    code: String!
    order: Order!
    org_id: String!
    invoice_id: String
    contact_id: String
    user_id: String
    dedication: String
    created_at: Timestamp
    updated_at: Timestamp
    deleted_at: Timestamp
    paid_at: Timestamp
  }

  type Mutation {
    CreateVoucher(input: VoucherInput!): Voucher!
    UpdateVoucher(id: ID!, input: VoucherInput!): Voucher!
    DeleteVoucher(id: ID!): Empty!
  }

  type Query {
    voucher(id: ID!): Voucher!
    vouchers(
      from: Int
      to: Int
      limit: Int
      offset: Int
      showInactive: Boolean
      query: String
    ): [Voucher!]!
  }
`;

export const VOUCHER_FRAGMENT = gql`
  fragment Voucher on Voucher {
    id
    order {
      id
      booking_code
      status_code
      expires_at
      order_type
      annotation
      contact {
        name
      }
    }
    code
    original_value
    value
    dedication
    created_at
    updated_at
    deleted_at
  }
`;

export const CREATE_VOUCHER = gql`
  mutation CreateVoucher($input: VoucherInput!) {
    CreateVoucher(input: $input) {
      ...Voucher
    }
  }
  ${VOUCHER_FRAGMENT}
`;

export const FETCH_VOUCHERS = gql`
  query Vouchers(
    $limit: Int
    $offset: Int
    $query: String
    $showInactive: Boolean
  ) {
    vouchers(
      limit: $limit
      offset: $offset
      query: $query
      showInactive: $showInactive
    ) {
      ...Voucher
    }
  }
  ${VOUCHER_FRAGMENT}
`;

export const FETCH_VOUCHER_BY_ID = gql`
  query Voucher($id: ID!) {
    voucher(id: $id) {
      ...Voucher
    }
  }
  ${VOUCHER_FRAGMENT}
`;

export const UPDATE_VOUCHER = gql`
  mutation UpdateVoucher($id: ID!, $input: VoucherInput!) {
    UpdateVoucher(id: $id, input: $input) {
      ...Voucher
    }
  }
  ${VOUCHER_FRAGMENT}
`;

export const DELETE_VOUCHER = gql`
  mutation DeleteVoucher($id: ID!) {
    DeleteVoucher(id: $id) {
      ok
    }
  }
`;
