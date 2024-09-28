import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    UpdateUser(id: $id, input: $input) {
      lang
      firstname
      lastname
      phone
      address {
        street
        city
        country
        postcode
      }
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($new_password: String!, $confirm_password: String!) {
    UpdatePassword(
      new_password: $new_password
      confirm_password: $confirm_password
    ) {
      ok
    }
  }
`;

export const UPDATE_COMPANY_INFO = gql`
  mutation UpdateOrg($id: ID!, $input: UpdateOrgInput!) {
    UpdateOrg(id: $id, input: $input) {
      id
      short_id
      slug
      features
      name
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
          country
          email
          phone
          postcode
        }
      }
    }
  }
`;

export const FILE_UPLOAD = gql`
  mutation FileUpload($file: Upload!) {
    FileUpload(file: $file) {
      url
    }
  }
`;

export const CREATE_EVENT_MEDIA_ITEM = gql`
  mutation CreateEventMediaItem($input: EventMediaItemInput!) {
    CreateEventMediaItem(input: $input) {
      ok
    }
  }
`;

export const DELETE_MEDIA_ITEM = gql`
  mutation FileDelete($id: ID, $type: String, $url: String!) {
    FileDelete(id: $id, type: $type, url: $url) {
      ok
    }
  }
`;

export const UPDATE_ORG_MEDIA = gql`
  mutation UpdateOrgMedia($id: ID!, $input: UpdateOrgMediaInput!) {
    UpdateOrgMedia(id: $id, input: $input) {
      id
      short_id
      name
      features
      media_logo_url
      media_web_bg_url
      media_ticket_bg_url
      media_voucher_bg_url
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: EventInput!) {
    CreateEvent(input: $input) {   
      id
      title
      static_total
      features
      status_code
      seating_plan {
        id
      }
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($input: UpdateEventInput!, $id: ID!) {
    UpdateEvent(input: $input, id: $id) {   
      id
      title
      subtitle
      status_code
      starts_at
      artist
      features
      detached
      location_id
      location {
        id
        name
      }
      totals {
        total
        booked
      }
    }
  }
`;
