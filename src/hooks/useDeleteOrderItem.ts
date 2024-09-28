import { useMutation } from "@apollo/client";
import { DELETE_ORDER_ITEM, FETCH_ORDER_BY_ID } from "../components/Orders/logic";

export function useDeleteOrderItem(id?: string) {
  const [doDeleteOrderItem, { loading, error }] = useMutation(DELETE_ORDER_ITEM, {
    update(cache: any, { data: { DeleteOrderItem: order } }: any) {
      cache.modify({
        id: cache.identify(order),
        fields: {
          contact_id() {
            return order.contact_id;
          },
        },
      });
    },
  });
  const deleteOrderItem = async (orderItemIds: Array<string | undefined>) => {
    await doDeleteOrderItem({ 
      variables: {
        order_id: id,
        item_ids: orderItemIds
      },
      refetchQueries: [
        {
          query: FETCH_ORDER_BY_ID,
          variables: { id }
        },
      ],
    });
  };

  return [deleteOrderItem, { loading, error }] as const;
}
