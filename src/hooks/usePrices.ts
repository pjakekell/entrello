import { useQuery } from "@apollo/client";
import { FETCH_PRICES_BY_EVENT_ID } from "../components/Prices/logic";

export function usePrices(event_id?: string) {
  const { error, data, loading } = useQuery(FETCH_PRICES_BY_EVENT_ID, {
    variables: { event_id },
  });
  if (!event_id) return [];

  return [
    data ? data.prices : null,
    {
      loading,
      error,
    },
  ];
}
