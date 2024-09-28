import { useMutation } from "@apollo/client";
import { UPDATE_ORDER_ITEM } from "../components/Orders/logic";

interface IUpdateOrderItemInput {
  qty: number;
  price_id?: string;
}

export function useUpdateOrderItem(id?: string) {
  const [doUpdateOrderItem, { loading, error }] = useMutation(UPDATE_ORDER_ITEM, {
    update(cache: any, { data: { UpdateOrderItem: order } }: any) {
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
  const updateOrderItem = async (input: IUpdateOrderItemInput, orderItemId?: string) => {
    await doUpdateOrderItem({
      variables: {
        id: orderItemId,
        order_id: id,
        input
      }
    });
  };

  return [updateOrderItem, { loading, error }] as const;
}
