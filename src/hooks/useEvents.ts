import { FETCH_EVENTS } from "../components/Event/logic";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";

export function useEvents(variables: any = { limit: 100 }) {
  let from: string | null = localStorage.getItem("fromEventFilter");
  if (
    !variables.from &&
    from &&
    !isNaN(parseInt(from)) &&
    dayjs(parseInt(from)).isValid()
  ) {
    variables.from = parseInt(from) / 1000;
  }
  const { error, data, loading, refetch } = useQuery(FETCH_EVENTS, {
    variables,
  });

  return [
    data ? data.events : null,
    {
      loading,
      error,
      refetch,
    },
  ];
}
