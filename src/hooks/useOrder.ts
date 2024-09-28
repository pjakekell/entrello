import { FETCH_ORDER_BY_ID } from "../components/Orders/logic";
import { useQuery } from "@apollo/client";

export function useOrder(id?: string) {
  const { error, data, loading } = useQuery(FETCH_ORDER_BY_ID, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    skip: !id,
  });

  return [
    data ? data.order : null,
    {
      loading,
      error,
    },
  ];
}
