import { useMutation, gql } from "@apollo/client";
import { EVENT_FRAGMENT, FETCH_EVENT_BY_ID } from "../components/Event/logic";

export const DUPLICATE_EVENT = gql`
  mutation DuplicateEvent(
    $event_id: ID!
    $starts_at: Timestamp!
    $duplicate_prices: Boolean!
    $duplicate_media: Boolean!
    $duplicate_event_deals: Boolean!
    $duplicate_optioned_orders: Boolean!
  ) {
    DuplicateEvent(
      event_id: $event_id
      starts_at: $starts_at
      duplicate_optioned_orders: $duplicate_optioned_orders
      duplicate_media: $duplicate_media
      duplicate_prices: $duplicate_prices
      duplicate_event_deals: $duplicate_event_deals
    ) {
      ...Event
    }
  }
  ${EVENT_FRAGMENT}
`;

interface IDuplicateEvent {
  starts_at: Date | undefined;
  duplicate_optioned_orders: boolean;
  duplicate_media: boolean;
  duplicate_prices: boolean;
  duplicate_event_deals: boolean;
}

export function useDuplicateEvent() {
  const [doDuplicateEvent, { loading, error }] = useMutation(DUPLICATE_EVENT, {
    update(cache: any, { data: { DuplicateEvent: event } }: any) {
      cache.refetchQueries([
        {
          query: FETCH_EVENT_BY_ID,
          variables: { id: event.id },
        },
      ]);
      /* cache.writeFragment({
        id: cache.identify(event),
        fragment: gql`
          ${EVENT_FRAGMENT}
        `,
        data: event,
      }); */
    },
  });
  const duplicateEvent = async (variables: IDuplicateEvent) => {
    const { data } = await doDuplicateEvent({
      variables,
    });
    return data ? data.DuplicateEvent : null;
  };

  return [duplicateEvent, { loading, error }] as const;
}
