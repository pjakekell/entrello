import { useLazyQuery } from "@apollo/client";
import { FETCH_SEAT_GROUP_BY_ID } from "../components/SeatGroup/logic";

export function useSeatGroup(id?: string) {
  const [fetchSeatGroups, { error, data, loading }] = useLazyQuery(
    FETCH_SEAT_GROUP_BY_ID
  );

  if (!id || id === "") {
    return [];
  }

  fetchSeatGroups({
    variables: { id },
  });

  return [data ? data.seat_group : null, { loading, error }];
}
