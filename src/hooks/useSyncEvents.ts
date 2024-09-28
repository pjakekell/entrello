import { FETCH_EVENTS_BY_SYNC_ID } from "../components/Event/logic";
import { useQuery } from "@apollo/client";

export function useSyncEvents(sync_id: string) {
  const { error, data, loading } = useQuery(FETCH_EVENTS_BY_SYNC_ID, {
    variables: { sync_id },
  });

  return [data ? data.events : null, { loading, error }];
}
