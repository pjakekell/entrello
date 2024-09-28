import gql from "graphql-tag";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    Login(email: $email, password: $password) {
      access_token
      refresh_token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation SignupUser(
    $email: String!
    $password: String!
    $name: String!
    $org_name: String!
    $lang: String!
  ) {
    Signup(
      email: $email
      password: $password
      name: $name
      org_name: $org_name
      lang: $lang
    ) {
      access_token
      refresh_token
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    Logout {
      ok
    }
  }
`;
