import gql from "graphql-tag";
import jwt_decode from "jwt-decode";

export const uidFromJWT = () => {
  const t = window.localStorage.getItem("t");
  if (!t) return null;

  const decoded: any = jwt_decode(t);
  return decoded.uid;
};

export const suFromJWT = () => {
  const t = window.localStorage.getItem("t");
  if (!t) return null;

  const decoded: any = jwt_decode(t);
  return decoded.suu;
};

export const FETCH_USER_BY_ID = gql`
  query UserById($id: ID!) {
    user(id: $id) {
      id
      name
      firstname
      lastname
      email
      lang
      abbr
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

// export const FETCH_USERS = gql`
//   query Users {
//     orgs {
//       id
//       name
//       short_id
//     }
//   }
// `;
