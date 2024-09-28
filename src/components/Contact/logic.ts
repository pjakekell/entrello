import gql from "graphql-tag";

export const buildContact = (attrs: any = {}) => {
  const defaults = {
    id: "",
    firstname: "",
    lastname: "",
    company: {
      addr: { country: "", postcode: "", city: "", street: "", name: "" },
    },
    addr: {
      street: "",
      city: "",
      postcode: "",
      country: "",
      phone: "",
      email: "",
    },
  };

  return { ...defaults, ...attrs };
};

export const ADDRESS_FRAGMENT = gql`
  fragment Address on Address {
    street
    city
    postcode
    country
  }
`;

export const CONTACT_FRAGMENT = gql`
  fragment Contact on Contact {
    id
    name
    firstname
    lastname
    email
    phone
    addr {
      ...Address
    }
  }
  ${ADDRESS_FRAGMENT}
`;

export const CREATE_CONTACT = gql`
  mutation CreateContact(
    $firstname: String
    $lastname: String
    $name: String
    $street: String
    $postcode: String
    $city: String
    $country: String
    $phone: String
    $email: String
  ) {
    CreateContact(
      input: {
        name: $name
        firstname: $firstname
        lastname: $lastname
        email: $email
        phone: $phone
        addr: {
          street: $street
          postcode: $postcode
          city: $city
          country: $country
        }
      }
    ) {
      ...Contact
    }
  }
  ${CONTACT_FRAGMENT}
`;

export const UPDATE_CONTACT = gql`
  mutation UpdateContact(
    $id: ID!
    $firstname: String!
    $lastname: String!
    $name: String!
    $street: String
    $postcode: String
    $city: String
    $country: String
    $phone: String
    $email: String
  ) {
    UpdateContact(
      id: $id
      input: {
        name: $name
        firstname: $firstname
        lastname: $lastname
        email: $email
        phone: $phone
        addr: {
          street: $street
          postcode: $postcode
          city: $city
          country: $country
        }
      }
    ) {
      ...Contact
    }
  }
  ${CONTACT_FRAGMENT}
`;

export const FETCH_CONTACT_BY_ID = gql`
  query fetchContactById($id: ID!) {
    contact(id: $id) {
      ...Contact
    }
  }
  ${CONTACT_FRAGMENT}
`;

export const FETCH_CONTACTS = gql`
  query fetchContacts($query: String) {
    contacts(query: $query) {
      ...Contact
    }
  }
  ${CONTACT_FRAGMENT}
`;
