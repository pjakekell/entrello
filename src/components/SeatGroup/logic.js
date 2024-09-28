import gql from "graphql-tag";

export const SEAT_GROUP_FRAGMENT = gql`
  fragment SeatGroup on SeatGroup {
    name
    pos
    num
    id
    parent_id
  }
`;

export const SECTION_FRAGMENT = gql`
  fragment Section on Section {
    name
    num
    id
  }
`;

export const FETCH_SECTIONS = gql`
  query fetchSection($event_id: ID!) {
    section(event_id: $event_id) {
      ...Section
    }
  }
  ${SECTION_FRAGMENT}
`;

export const FETCH_SECTION = gql`
  query fetchSection($id: ID!, $event_id: ID!) {
    section(event_id: $event_id, id: $id) {
      ...Section
    }
  }
  ${SECTION_FRAGMENT}
`;

export const CREATE_SECTION = gql`
  mutation createSection($event_id: ID!, $name: String!, $num: String!) {
    createSection(input: { name: $name, num: $num }, event_id: $event_id) {
      ...Section
    }
  }
  ${SECTION_FRAGMENT}
`;

export const UPDATE_SECTION = gql`
  mutation updateSection(
    $event_id: ID
    $id: ID
    $name: String
    $free_standing: Boolean
  ) {
    updateSection(
      input: {
        name: $name
        event_id: $event_id
        id: $id
        free_standing: $free_standing
      }
    ) {
      ...Section
    }
  }
  ${SECTION_FRAGMENT}
`;

export const CREATE_SEAT_GROUP = gql`
  mutation CreateSeatGroup($input: SeatGroupInput!) {
    CreateSeatGroup(input: $input) {
      id
      num
      name
    }
  }
`;

export const FETCH_SEAT_GROUPS = gql`
  query SeatGroups(
    $query: String
    $limit: Int
    $parent_id: ID
    $seating_plan_id: ID!
  ) {
    seat_groups(
      query: $query
      limit: $limit
      parent_id: $parent_id
      seating_plan_id: $seating_plan_id
    ) {
      ...SeatGroup
    }
  }
  ${SEAT_GROUP_FRAGMENT}
`;

export const FETCH_SEAT_GROUP_BY_ID = gql`
  query SeatGroup($id: ID!) {
    seat_group(id: $id) {
      ...SeatGroup
    }
  }
  ${SEAT_GROUP_FRAGMENT}
`;
