import { useMutation, gql } from "@apollo/client";
import useEventDeals from "./useEventDeals";
import { IEventDeal } from "../components/Event/interfaces";

export const ADD_PRICE_TO_EVENT_DEAL = gql`
  mutation AddPriceToEventDeal($event_id: ID!, $deal_id: ID!, $price_id: ID!) {
    AddPriceToEventDeal(
      event_id: $event_id
      deal_id: $deal_id
      price_id: $price_id
    ) {
      id
      price_ids
      tickets_limit
    }
  }
`;

export const DELETE_PRICE_FROM_EVENT_DEAL = gql`
  mutation DeletePriceFromEventDeal(
    $event_id: ID!
    $deal_id: ID!
    $price_id: ID!
  ) {
    DeletePriceFromEventDeal(
      event_id: $event_id
      deal_id: $deal_id
      price_id: $price_id
    ) {
      id
      price_ids
      tickets_limit
    }
  }
`;

export function useToggleEntrelloDeal(event_id: string, price_id: string) {
  const [eventDeals] = useEventDeals(event_id);
  const [enableEntrelloDeal, { loading: loadingEnable }] = useMutation(
    ADD_PRICE_TO_EVENT_DEAL
  );
  const [disableEntrelloDeal, { loading: loadingDisable }] = useMutation(
    DELETE_PRICE_FROM_EVENT_DEAL
  );
  const toggleEntrelloDeal = async (deal_id: string | null) => {
    const eventDeal = eventDeals.find(
      (ed: IEventDeal) =>
        ed.deal_id === deal_id && ed.price_ids.includes(price_id)
    );
    if (eventDeal) {
      await disableEntrelloDeal({ variables: { event_id, deal_id, price_id } });
      return;
    }
    await enableEntrelloDeal({
      variables: { event_id, deal_id, price_id },
    });
  };

  return [toggleEntrelloDeal, loadingEnable || loadingDisable] as const;
}
