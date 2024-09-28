import gql from "graphql-tag";
import jwt_decode from "jwt-decode";

export const PAYMENT_METHOD_CASH = 0b1;
export const PAYMENT_METHOD_DEBIT_CREDIT_CARD = 0b1 << 1;
export const PAYMENT_METHOD_BANK_TRANSFER = 0b1 << 2;
export const PAYMENT_METHOD_STRIPE_EPS = 0b1 << 2;
export const PAYMENT_METHOD_STRIPE_GIROPAY = 0b1 << 2;
export const PAYMENT_METHOD_STRIPE_SOFORT = 0b1 << 2;
export const PAYMENT_METHOD_STRIPE_CREDITCARD = 0b1 << 2;
export const PAYMENT_METHOD_STRIPE_MOTO = 0b1 << 2;

export const oidFromJWT = () => {
  const t = window.localStorage.getItem("t");
  if (!t) return null;

  const decoded: any = jwt_decode(t);
  return decoded.oid;
};

const fragments = {
  ImportantNotifications: gql`
    fragment ImportantNotifications on Org {
      important_notifications {
        title
        text
        to
        toText
      }
    }
  `,
  OrgAddress: gql`
    fragment OrgAddress on Org {
      addr {
        street1
        street2
        city
        state
        postcode
        country_code
        web
        phone
        email
      }
    }
  `,
  Individual: gql`
    fragment Individual on Org {
      individual {
        street1
        street2
        city
        state
        postcode
        country_code
        phone
        email
        firstname
        lastname
        dob {
          day
          month
          year
        }
      }
    }
  `,
};

export const SETUP_PAYMENTS = gql`
  mutation setupPayments(
    $id: ID!
    $enabled: Boolean!
    $web: String
    $country_code: String
    $business_type: String
    $features: Array
  ) {
    setupPayments(
      input: {
        id: $id
        enabled: $enabled
        features: $features
        business_type: $business_type
        addr: { country_code: $country_code, web: $web }
      }
    ) {
      id
      name
      features
      stripe_charges
      business_type
      addr_setup_completed
      ...Individual
      ...OrgAddress
      ...ImportantNotifications
    }
  }
  ${fragments.ImportantNotifications}
  ${fragments.OrgAddress}
  ${fragments.Individual}
`;

export const UPDATE_ORG = gql`
  mutation UpdateOrg($id: ID!, $input: UpdateOrgInput!) {
    UpdateOrg(id: $id, input: $input) {
      id
      name
      features
      accepted_payment_methods
      company_info {
        name
        vat_id
      }
    }
  }
`;

export const FETCH_ORG_BY_ID = gql`
  query OrgById($id: ID!) {
    org(id: $id) {
      id
      name
      slug
      short_id
      stripe_acc_id
      accepted_payment_methods
      features
      media_logo_url
      media_web_bg_url
      media_ticket_bg_url
      media_voucher_bg_url
      company_info {
        name
        vat_id
        url
        support_url
        support_email
        support_phone
        business_type
        registration_num
        address {
          street
          city
          postcode
          country
          phone
          email
        }
      }
    }
  }
`;

export const FETCH_ORGS = gql`
  query Orgs {
    orgs {
      id
      name
      short_id
    }
  }
`;

export const SWITCH_ORG = gql`
  mutation SwitchOrg($refresh_token: String!, $org_id: ID!) {
    Refresh(refresh_token: $refresh_token, org_id: $org_id) {
      access_token
      refresh_token
    }
  }
`;
