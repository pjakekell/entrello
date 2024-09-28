import { useQuery, gql } from "@apollo/client";

export const FETCH_TAX_GROUPS = gql`
  query fetchTaxGroups {
    tax_groups {
      id
      name
      tax_rate
    }
  }
`;

export function useTaxGroups() {
  const { error, data, loading } = useQuery(FETCH_TAX_GROUPS);
  return [data ? data.tax_groups : null, { loading, error }];
}
