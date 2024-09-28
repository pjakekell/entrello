import { useMutation } from "@apollo/client";
import {
  UPDATE_EVENT_STATUS,
  FETCH_EVENT_BY_ID,
} from "../components/Event/logic";
import { IEvent } from "../components/Event/interfaces";

export function useToggleEventStatus(event: IEvent) {
  const [doUpdateEvent, updateInfo] = useMutation(UPDATE_EVENT_STATUS);
  const toggleStatus = async (statusBit: number) => {
    const status_code =
      event.status_code & statusBit
        ? event.status_code ^ statusBit
        : event.status_code | statusBit;
    await doUpdateEvent({
      variables: { id: event.id, status_code },
      refetchQueries: [
        {
          query: FETCH_EVENT_BY_ID,
          variables: { id: event.id },
        },
      ],
    });
  };

  return [toggleStatus, updateInfo] as const;
}
