import { FETCH_ORDERS } from "../components/Orders/logic";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";

export function useOrders(
  variables: any
) {
  const defaultVariables = { limit: 100, sort: "booking_code", desc: true };
  variables = {
    ...defaultVariables,
    ...variables
  }

  let from: string | null = localStorage.getItem("fromOrderFilter");

  if (
    !variables.from &&
    from &&
    !isNaN(parseInt(from)) &&
    dayjs(parseInt(from)).isValid()
  ) {
    variables.from = parseInt(from) / 1000;
  }
  const { error, loading, data } = useQuery(FETCH_ORDERS, {
    variables,
  });

  return [
    data ? data.orders : null,
    {
      loading,
      error,
    },
  ];
}
