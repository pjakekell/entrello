import { ORDERS_SUBSCRIPTION } from "../components/Orders/logic";
import { useSubscription } from "@apollo/react-hooks";
import { IOrder } from "../components/Orders/interfaces";

export function useOrderSubscription(cb?: (order: IOrder) => {}) {
  const { data } = useSubscription(ORDERS_SUBSCRIPTION, {
    variables: { token: localStorage.getItem("t") },
  });
  if (!data || !data.orderChanged) return;

  const order: IOrder = data.orderChanged;
  if (typeof cb === "function") cb(order);
}
