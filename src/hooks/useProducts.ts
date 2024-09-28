import { FETCH_PRODUCTS } from "../pages/Products/logic";
import { useQuery } from "@apollo/client";

export function useProducts(variables?: any) {
  const defaultVariables = { limit: 100 };
  variables = {
    ...defaultVariables,
    ...variables,
  };
  const { error, data, loading, refetch } = useQuery(FETCH_PRODUCTS, {
    variables
  });

  return [
    data ? data.products : null,
    {
      loading,
      error,
      refetch,
    },
  ];
}
