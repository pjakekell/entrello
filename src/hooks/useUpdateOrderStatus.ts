import { useMutation } from "@apollo/client";
import {
  UPDATE_ORDER_STATUS,
  FETCH_ORDER_BY_ID,
} from "../components/Orders/logic";

export function useUpdateOrderStatus(id: string) {
  const [doUpdateOrderStatus, { loading, error }] = useMutation(
    UPDATE_ORDER_STATUS,
    {
      refetchQueries: [
        {
          query: FETCH_ORDER_BY_ID,
          variables: { id },
        },
      ],
    }
  );
  const updateOrderStatus = async (status_code: number) => {
    await doUpdateOrderStatus({ variables: { id, status_code } });
  };

  return [updateOrderStatus, loading, error] as const;
}
