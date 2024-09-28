import { FETCH_ORDERS_BY_FILTER } from "../components/Orders/logic";
import { useQuery } from "@apollo/client";

export function useOrdersFilter(variables: any) {
  const { error, data, loading, refetch } = useQuery(FETCH_ORDERS_BY_FILTER, {
    variables: JSON.parse(JSON.stringify(variables))
  });

  return [
    data ? data.orders : null,
    {
      loading,
      error,
      refetch
    },
  ];
}