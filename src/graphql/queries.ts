import { gql } from "@apollo/client";

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      title
      media_web_bg_urls
    }
  }
`;
