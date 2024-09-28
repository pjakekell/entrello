import { useMutation } from "@apollo/client";
import { CREATE_ORDER } from "../components/Orders/logic";
import { IOrderItem } from "../components/Orders/interfaces";

export function useCreateOrder() {
  const [createOrder, { loading, error }] = useMutation(CREATE_ORDER);

  const doCreateOrder = (items: IOrderItem[]) => {
    return createOrder({ variables: { items } });
  };
  return [doCreateOrder, { loading, error }] as const;
}
