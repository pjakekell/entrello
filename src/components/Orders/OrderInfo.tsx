import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";

import { IOrder, IOrderItem } from "../Orders/interfaces";
import isEmpty from "lodash/isEmpty";
import { useMutation } from "@apollo/react-hooks";
import { useFormik } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import GroupedItemsListing from "./GroupedItemsListing";
import PayItemsListing from "./PayItemsListing";
import SplitOrdersListing from "./SplitOrdersListing";
import { DATE_WITH_TIME_FORMAT } from "../../utils/datetime_helpers";
import ContactShortInfo from "../Contact/ContactShortInfo";
import FieldWrap from "./FieldWrap";
import {
  UPDATE_ORDER,
  ORDER_STATUS_PAID,
  ORDER_STATUS_DELETED,
  ORDER_TYPE_RESERVATION,
  ORDER_TYPE_OPTION,
  FULL_ORDER_FRAGMENT,
} from "./logic";
import LoadingIcon from "../Btn/LoadingIcon";
import OrderStatusBtn from "./OrderStatusBtn";
import OrderTypeBtn from "./OrderTypeBtn";
import SellOrderBtn from "./SellOrderBtn";
import DownloadItemsBtn from "./DownloadItemsBtn";
import SplitOrderBtn from "./SplitOrderBtn";
import RefundOrderBtn from "./RefundOrderBtn";

import { setActiveSeatsByOrderId } from "../Spl/tools/seat_active_toggles";

import { toast } from "react-hot-toast";
import messages from "../../i18n/messages";
import { client } from "../../apollo-client";
import { useIntl } from "react-intl";
import LoadingBtn from "../Btn/LoadingBtn";
import Btn from "../Btn/Btn";
import { useUpdateOrder } from "../../hooks/useUpdateOrder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faClock } from "@fortawesome/pro-regular-svg-icons";

import FormattedDuration from "../FormattedDuration";
import { Link } from "react-router-dom";
import { useOrder } from "../../hooks/useOrder";
import { EVENT_FEATURE_SPL } from "../Event/logic";
import { useEvent } from "../../hooks/useEvent";

interface IOrderInfoParams {
  id: string;
}

interface ITitleParams {
  order: IOrder;
}

const Title = ({ order }: ITitleParams) => {
  const { formatMessage: f } = useIntl();
  const location = useLocation();

  const handleCopyBookingCode = () => {
    navigator.clipboard.writeText(order.booking_code);
    toast(f(messages.copiedToClipboard));
  };

  return (
    <div>
      <div
        className={`p-4 border-b ${
          (order.status_code & ORDER_STATUS_DELETED) > 0
            ? "border-red-400 bg-red-200 text-red-800"
            : "border-gray-300 bg-gray-100 text-gray-600"
        }`}
      >
        <div className="flex items-center">
          <div>
            <div className="uppercase text-xs leading-tight">
              {order.split_order_id ? (
                <div className="font-bold">
                  <span className="">{f(messages.splitOrder)} </span>(
                  <Link
                    to={`${location.pathname.split("/ord_")[0]}/${
                      order.split_order_id
                    }`}
                    className="text-brand-600"
                  >
                    {order.split_order_booking_code}
                  </Link>
                  )
                </div>
              ) : (
                f(messages.order)
              )}
            </div>
            <div
              className="text-sm text-brand-600 leading-tight cursor-pointer"
              onClick={handleCopyBookingCode}
            >
              {order.booking_code}
            </div>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-1">
              {order.status_code >= ORDER_STATUS_PAID ? (
                <DownloadItemsBtn order={order} />
              ) : null}
              {order.order_type === ORDER_TYPE_RESERVATION ||
              order.order_type === ORDER_TYPE_OPTION ? (
                <SplitOrderBtn order={order} />
              ) : null}
              {order.status_code < ORDER_STATUS_PAID ? <SellOrderBtn /> : null}
              {!(order.status_code & ORDER_STATUS_PAID) ||
              order.status_code & ORDER_STATUS_DELETED ? null : (
                <RefundOrderBtn order={order} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const OrderActions = ({ order }: IOrderActionParams) => {
//   const formik = useFormikContext();
//   const { formatMessage: f } = useIntl();
//   // const client = useApolloClient();
//   const [updateOrder] = useMutation(UPDATE_ORDER, {
//     update(cache: any, { data: { UpdateOrder: order } }: any) {
//       cache.modify({
//         fields: {
//           orders(existingOrders = []) {
//             const newOrderRef = cache.writeFragment({
//               data: order,
//               fragment: FULL_ORDER_WO_ITEMS_FRAGMENT,
//             });
//             return [...existingOrders, newOrderRef];
//           },
//         },
//       });
//     },
//   });

//   const handleSave = async () => {
//     const variables: any = formik.values || {};
//     variables.id = order.id;
//     await updateOrder({ variables });
//     // client.writeFragment({
//     //   id: `Order:${order.id}`,
//     //   fragment: gql`
//     //     fragment WriteFragmentOrder on Order {
//     //       annotation
//     //       booking_code
//     //     }
//     //   `,
//     //   data: {
//     //     annotation: "othe rname",
//     //     booking_code: 123,
//     //   },
//     // });
//   };

//   const confirmed = order.status_code > 2;

//   return (
//     <div className="order-actions">
//       <ButtonGroup>
//         <Button intent={Intent.PRIMARY} outlined onClick={handleSave}>
//           {f(messages.save)}
//         </Button>
//         {order.status_code < ORDER_STATUS_INVOICED ? (
//           <Button
//             intent={confirmed ? Intent.SUCCESS : Intent.NONE}
//             disabled={!confirmed}
//           >
//             {f(messages.sell)}
//           </Button>
//         ) : null}
//         {order.status_code >= ORDER_STATUS_INVOICED &&
//         order.status_code < ORDER_STATUS_PARTIALLY_REFUNDED ? (
//           <Button intent={Intent.WARNING}>{f(messages.refund)}</Button>
//         ) : null}
//         <Button intent={Intent.PRIMARY} outlined icon="print"></Button>
//         <Popover2
//           content={<EditOrderMenu order={order} />}
//           placement="bottom-end"
//         >
//           <Button intent={Intent.PRIMARY} outlined icon="more"></Button>
//         </Popover2>
//       </ButtonGroup>
//     </div>
//   );
// };

const AnnotationInfo = ({ order }: ITitleParams) => {
  const { formatMessage: f } = useIntl();
  const [updateOrder, { loading, error }] = useMutation(UPDATE_ORDER, {
    update(cache: any, { data: { UpdateOrder: order } }: any) {
      cache.modify({
        id: cache.identify(order),
        fields: {
          annotation() {
            return order.annotation;
          },
        },
      });
    },
  });
  const textAreaRef = useRef(null);
  const [editAnnotation, setEditAnnotation] = useState(false);
  const formik = useFormik({
    initialValues: {
      annotation: order.annotation || "",
    },
    onSubmit,
  });
  async function onSubmit() {
    try {
      const { data } = await updateOrder({
        variables: {
          id: order.id,
          input: {
            annotation: formik.values.annotation,
          },
        },
      });
      if (data.UpdateOrder) {
        setEditAnnotation(false);
        return;
      }
      console.error("unexpected return value from server", data);
    } catch (e) {
      console.error(e);
    }
  }

  const handleToggleEditAnnotation = () => {
    setEditAnnotation(!editAnnotation);
  };

  return (
    <div className="py-1">
      <FieldWrap label={f(messages.annotation)} className="items-start">
        <div className="text-sm cursor-pointer flex-grow">
          {editAnnotation ? (
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col items-end mr-2"
            >
              <textarea
                className="block rounded w-full focus:shadow-orange-400"
                onChange={formik.handleChange}
                name="annotation"
                ref={textAreaRef}
                autoFocus
                value={formik.values.annotation}
              />
              <div className="flex mt-1">
                <Btn
                  className="mr-0.5"
                  color="default"
                  sm
                  onClick={handleToggleEditAnnotation}
                >
                  {f(messages.cancel)}
                </Btn>
                <LoadingBtn
                  sm
                  type="submit"
                  loading={loading}
                  color="primary"
                  disabled={loading || !formik.dirty}
                  onClick={() => formik.handleSubmit()}
                >
                  {f(messages.save)}
                </LoadingBtn>
              </div>
            </form>
          ) : null}
          {isEmpty(order.annotation) && !editAnnotation ? (
            <div className="text-gray-400" onClick={handleToggleEditAnnotation}>
              {f(messages.clickToAddAnnotation)}
            </div>
          ) : null}
          {!isEmpty(order.annotation) && !editAnnotation ? (
            <div
              className="text-sm text-gray-600"
              onClick={handleToggleEditAnnotation}
            >
              {order.annotation}
            </div>
          ) : null}
          {error && error.message ? (
            <span className="text-xs text-red-600 bg-red-100 p-4 rounded">
              {error.message}
            </span>
          ) : null}
        </div>
      </FieldWrap>
    </div>
  );
};

const Loading = () => (
  <div className="flex items-center justify-center p-4 m-4">
    <LoadingIcon color="text-gray-500" />
  </div>
);

const OrderTitle = ({ order }: ITitleParams) => {
  const { formatMessage: f } = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const  eventId: any = useMemo(() => {
    let id = "";
    if (order?.order_items?.length) {
      const orderItem = order.order_items.find((item: IOrderItem) => item.event_id);
      id = orderItem?.event_id || "";
    }
    return id;
  }, [order]);

  const [event] = useEvent(eventId || "");

  const handleClick = () => navigate(`/events/${eventId}${event?.seating_plan ? "/spl" : ""}/o/${order.id}`);

  const eventLink = eventId ? (
    <div
      onClick={handleClick}
      className="flex items-center w-full mr-4 cursor-pointer group"
    >
      <div className="text-indigo-500 group-hover:text-indigo-700">
        {order.title}
      </div>
      {!location.pathname.includes("spl/orders") && !!(event?.features & EVENT_FEATURE_SPL) ? (
        <div className="ml-auto text-2xs text-indigo-500 group-hover:text-indigo-700 flex items-center uppercase">
          <div>{f(messages.seatingPlan)}</div>
          <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3 ml-1" />
        </div>
      ) : null}
    </div>
  ) : (
    <span className="text-indigo-500">{order.title}</span>
  );

  return (
    <div className="py-1">
      <FieldWrap label={f(messages.title)} className="items-start">
        {eventLink}
      </FieldWrap>
    </div>
  );
};

const OrderTimestamps = ({ order }: ITitleParams) => {
  const { formatMessage: f, formatDate: d } = useIntl();

  const formattedCreatedAt = order.created_at
    ? d(order.created_at, DATE_WITH_TIME_FORMAT)
    : "";
  const formattedCreatedBy =
    order.logs && order.logs.length > 0 && order.logs[0].by_name
      ? order.logs[0].by_name
      : "";

  return (
    <div className="py-1">
      <FieldWrap label={f(messages.created)}>
        {formattedCreatedAt} ({formattedCreatedBy || f(messages.system)})
      </FieldWrap>
      {order.deleted_at ? (
        <FieldWrap
          label={f(messages.deleted)}
          className="bg-red-200 text-red-600 py-2"
        >
          {d(order.deleted_at, DATE_WITH_TIME_FORMAT)}
        </FieldWrap>
      ) : null}
    </div>
  );
};

export default function OrderInfo({ id }: IOrderInfoParams) {
  const { formatMessage: f } = useIntl();
  const [fullOrder] = useOrder(id);

  const [
    updateOrder,
    { loading: updateOrderLoading, error: updateOrderError },
  ] = useUpdateOrder(id);

  const cachedOrder = client.readFragment({
    id: `Order:${id}`,
    fragment: FULL_ORDER_FRAGMENT,
    fragmentName: "FullOrder",
  });
  const order = fullOrder ? fullOrder : cachedOrder;

  const selectSeatsInSplIfNewId = useCallback(
    () => setActiveSeatsByOrderId(id),
    [id]
  );

  useEffect(() => selectSeatsInSplIfNewId(), [selectSeatsInSplIfNewId]);

  if (!order) return <Loading />;

  return (
    <div
      className={`h-full ${
        order && order.status_code === ORDER_STATUS_DELETED
          ? "border-red-600 border-l-4"
          : "border-gray-300"
      }`}
    >
      <Title order={order} />
      <div className="py-1 mt-2">
        <div className="flex items-center pb-4">
          <div className="ml-6 w-24 text-gray-400 uppercase text-xs">
            {f(messages.status)}
          </div>
          <OrderStatusBtn order={order} />
          <OrderTypeBtn order={order} />
        </div>
        {order.expires_at && order.expires_at !== "0001-01-01T00:00:00Z" ? (
          <div className="flex items-center pb-4">
            <div className="ml-6 w-24 text-gray-400 uppercase text-xs">
              {f(messages.expires)}
            </div>
            <div className="text-xs flex items-center">
              <FontAwesomeIcon icon={faClock} className="h-3 w-3 mb-0.5" />
              <div className="leading-none">
                <FormattedDuration
                  value={new Date(order.expires_at).getTime()}
                  countdown
                />
              </div>
            </div>
          </div>
        ) : null}

        <OrderTitle order={order} />
        <OrderTimestamps order={order} />
        <ContactShortInfo
          contact={order.contact}
          update={updateOrder}
          error={updateOrderError}
          loading={updateOrderLoading}
        />
        <AnnotationInfo order={order} />
      </div>
      {order.split_orders.length > 0 ? (
        <SplitOrdersListing orders={order.split_orders} />
      ) : null}
      {order.pay_items && order.pay_items.length > 0 ? (
        <PayItemsListing order={order} />
      ) : null}
      <GroupedItemsListing order={order} />
      {/*<OrderItemsListing order={order} />*/}
    </div>
  );
}
