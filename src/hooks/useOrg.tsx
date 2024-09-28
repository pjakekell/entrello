import { oidFromJWT, FETCH_ORG_BY_ID } from "../../src/components/Org/logic";
import { useQuery, gql } from "@apollo/client";
import { IOrg } from "../components/Org/interfaces";

export function useOrg(): [IOrg, any] {
  const { error, data, loading } = useQuery(FETCH_ORG_BY_ID, {
    variables: { id: oidFromJWT() },
  });

  return [data ? data.org : null, { loading, error }];
}
export const FETCH_TAX_GROUPS = gql`
  query fetchTaxGroups {
    tax_groups {
      id
      name
      tax_rate
    }
  }
`;
