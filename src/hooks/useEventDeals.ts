import { useQuery, gql } from "@apollo/client";

export const GET_EVENT_DEALS = gql`
  query eventDeals($event_id: ID!) {
    event_deals(event_id: $event_id) {
      id
      price_ids
      deal_id
      tickets_limit
      reseller_org_id
    }
  }
`;

export default function useEventDeals(event_id: string | undefined) {
  const { data, loading } = useQuery(GET_EVENT_DEALS, {
    variables: { event_id },
  });
  return [data ? data.event_deals : [], loading] as const;
}
