import { FETCH_VOUCHERS } from "../pages/Vouchers/logic";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";

export function useVouchers(variables: any = {}) {
  let from: string | null = localStorage.getItem("vFrom");
  const defaultVariables = { limit: 100, showInactive: true };
  variables = {
    ...defaultVariables,
    ...variables,
  };
  if (
    !variables.from &&
    from &&
    !isNaN(parseInt(from)) &&
    dayjs(parseInt(from)).isValid()
  ) {
    variables.from = parseInt(from) / 1000;
  }
  const { error, data, loading, refetch } = useQuery(FETCH_VOUCHERS, {
    variables,
  });

  return [
    data ? data.vouchers : null,
    {
      loading,
      error,
      refetch,
    },
  ];
}
