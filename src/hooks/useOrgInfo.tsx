import { useQuery } from "@apollo/client";
import { FETCH_ORG_BY_ID, oidFromJWT } from "../components/Org/logic";

export function useOrgInfo() {
  const {
    error: errorOrgInfo,
    data: dataOrgInfo,
    loading: loadingOrgInfo,
  } = useQuery(FETCH_ORG_BY_ID, {
    variables: { id: oidFromJWT() },
  });

  return {
    errorOrgInfo,
    dataOrgInfo,
    loadingOrgInfo,
  };
}
