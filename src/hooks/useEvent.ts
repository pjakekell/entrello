import { FETCH_EVENT_BY_ID } from "../components/Event/logic";
import { useQuery } from "@apollo/client";

export function useEvent(id: string) {
  const { error, data, loading } = useQuery(FETCH_EVENT_BY_ID, {
    variables: { id },
  });

  return [
    data ? data.event : null,
    {
      loading,
      error,
    },
  ];
}
