import { gql } from "@apollo/react-hooks";

export const ADD_USERS_TO_AN_ORGANIZATION = gql`
    mutation AddUsersToOrganization($emails: [String!]!, $role: Int!) {
        AddUsersToOrganization(emails: $emails, role: $role) {
            email
            access
        }
    }
`

export const FETCH_USERS_OF_ORG = gql`
    query users ($query: String) {
        users (query: $query) {
            id
            firstname
            lastname
            lang
            role
            email
            phone
        }
    }
`