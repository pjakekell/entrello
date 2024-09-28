import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { CREATE_ORDER, CREATE_SPLIT_ORDER } from "../components/Orders/logic";
import { addOrderIdToSeats } from "../components/Spl/tools/seat_active_toggles";
import { setMsg } from "../components/Toaster/logic";
import { IOrderItem } from "../components/Orders/interfaces";
import { useIntl } from "react-intl";

import messages from "../i18n/messages";

export function useCreateSplOrder(splitOrder: boolean) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatMessage: f } = useIntl();
  const [createSplitOrder, { loading, error }] = useMutation(
    splitOrder ? CREATE_SPLIT_ORDER : CREATE_ORDER,
    {
      onCompleted: ({ CreateOrder: order }) => {
        const evPart = location.pathname.split(`/spl`)[0];
        dispatch(
          setMsg({
            title: f(messages.orderCreated, {
              booking_code: order.booking_code,
            }),
          })
        );
        addOrderIdToSeats(
          order.order_items.map((i: IOrderItem) => i.seat_id),
          order.id
        );
        navigate(`${evPart}/spl/o/${order.id}`);
      },
      onError: (error: any) =>
        dispatch(
          setMsg({
            title: f(messages.savingFailed),
            desc: error.message,
            level: "error",
          })
        ),
    }
  );
  return [createSplitOrder, { loading, error }] as const;
}
