import { useMutation } from "@apollo/client";
import { UPDATE_ORDER } from "../components/Orders/logic";

interface IUpdateOrderInput {
  title?: string;
  order_type?: string;
  subtitle?: string;
  status_code?: number;
  annotation?: string;
  contact_id?: string;
}

export function useUpdateOrder(id?: string) {
  const [doUpdateOrder, { loading, error }] = useMutation(UPDATE_ORDER, {
    update(cache: any, { data: { UpdateOrder: order } }: any) {
      cache.modify({
        id: cache.identify(order),
        fields: {
          contact_id() {
            return order.contact_id;
          },
        },
      });
    },
    /* refetchQueries: [
      {
        query: FETCH_ORDER_BY_ID,
        variables: { id },
      },
    ], */
  });
  const updateOrder = async (input: IUpdateOrderInput, orderId?: string) => {
    await doUpdateOrder({ variables: { id: orderId ? orderId : id, input } });
  };

  return [updateOrder, { loading, error }] as const;
}
