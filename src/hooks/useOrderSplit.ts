import { FETCH_SPLIT_ORDER_BY_ID } from "../components/Orders/logic";
import { useQuery } from "@apollo/client";

export function useOrderSplit(split_order_id?: string | null) {
  const { error, data, loading } = useQuery(FETCH_SPLIT_ORDER_BY_ID, {
    variables: { split_order_id }
  });

  return [
    data ? data.order : null,
    {
      loading,
      error,
    },
  ];
}
