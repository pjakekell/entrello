import { uidFromJWT, FETCH_USER_BY_ID } from "../../src/components/User/logic";
import { useQuery } from "@apollo/client";

export function useUser() {
  const {
    error: errorUserId,
    data: dataUserId,
    loading: loadingUserId,
  } = useQuery(FETCH_USER_BY_ID, {
    variables: { id: uidFromJWT() },
  });

  return {
    errorUserId,
    dataUserId,
    loadingUserId,
  };
}
