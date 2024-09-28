import { GET_EVENT } from "../graphql/queries";
import { useQuery } from "@apollo/client";

export function useEventMedia(id: string) {
  const { error, data, loading } = useQuery(GET_EVENT, {
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
