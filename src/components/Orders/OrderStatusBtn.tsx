import React, { Fragment } from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages.js";
import {
  getOrderStatus,
  ORDER_STATUS_BOOKED,
  ORDER_STATUS_DELETED,
  ORDER_STATUS_PAID,
} from "./logic";
import { Menu, Transition } from "@headlessui/react";
import { IOrder } from "./interfaces";
import LoadingIcon from "../Btn/LoadingIcon";
import { ChevronDownIcon, SaveIcon } from "@heroicons/react/outline";
import { classNames } from "../../utils/misc";
import { useUpdateOrderStatus } from "../../hooks/useUpdateOrderStatus";

interface IToggleItem {
  icon: any;
  label: string;
  desc: string;
  order: IOrder;
  statusNum: number;
}

const ToggleItem = ({ icon, desc, label, statusNum, order }: IToggleItem) => {
  const [updateOrderStatus, loading, error] = useUpdateOrderStatus(order.id);

  const handleToggleAction = async () => {
    try {
      await updateOrderStatus(statusNum);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Menu.Item>
      {({ active }) => (
        <div
          className={classNames(
            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
            "px-4 py-2 flex items-start cursor-pointer"
          )}
          onClick={handleToggleAction}
        >
          <div>{loading ? <LoadingIcon /> : icon}</div>
          <div>
            <div className="ml-2 text-xs font-bold text-gray-700 uppercase">
              {error ? error.message : label}
            </div>
            <div className="ml-2 text-xs text-gray-500">{desc}</div>
          </div>
        </div>
      )}
    </Menu.Item>
  );
};

interface IOrderStatusBtnParams {
  order: IOrder;
}

const orderStatusColors = {
  [ORDER_STATUS_BOOKED]:
    "bg-indigo-400 border-indigo-400 focus:ring-offset-indigo-100 focus:ring-indigo-400",
  [ORDER_STATUS_PAID]:
    "bg-green-500 border-green-500 focus:ring-offset-white focus:ring-green-600",
  [ORDER_STATUS_DELETED]:
    "bg-red-500 border-red-600 focus:ring-offset-white focus:ring-red-600",
  DEFAULT:
    "bg-yellow-500 border-yellow-500 focus:ring-offset-yellow-100 focus:ring-yellow-500",
};

const orderTypeColors = {
  RESERVATION:
    "bg-fuchsia-600 border-fuchsia-600 focus:ring-offset-fuchsia-600 focus:ring-fuchsia-600",
  OPTION:
    "bg-fuchsia-600 border-fuchsia-600 focus:ring-offset-fuchsia-600 focus:ring-fuchsia-600",
} as any;

const OrderStatusBtn = ({ order }: IOrderStatusBtnParams) => {
  const { formatMessage: f } = useIntl();

  const status = getOrderStatus(order);
  const commonBtnCss = "h-6 w-6 mr-2";

  const msg =
    status.refunded ||
    status.partially_refunded ||
    status.paid ||
    status.invoiced ||
    status.booked ||
    status.claimed ||
    status.deleted ||
    status.invalid;
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button
              className={classNames(
                order.order_type !== "OPTION" &&
                  order.order_type !== "RESERVATION"
                  ? orderStatusColors[order.status_code] ||
                      orderStatusColors.DEFAULT
                  : orderTypeColors[order.order_type],
                "flex items-center group cursor-pointer rounded-md border-2 hover:shadow-sm px-4 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 z-10"
              )}
            >
              <div
                className={classNames(
                  "uppercase text-xs pt-0.5 mr-2 text-white flex items-center gap-2"
                )}
              >
                <div>{f(msg as any)}</div>
              </div>
              {status.claimed && !status.booked ? (
                <div className="h-4">
                  <ChevronDownIcon className="w-4 h-4 text-gray-50 group-hover:text-white" />
                </div>
              ) : null}
            </Menu.Button>
          </div>

          {order.status_code < ORDER_STATUS_BOOKED ? (
            <Transition
              as={Fragment}
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="p-1 divide-y">
                  {status.claimed && !status.booked ? (
                    <ToggleItem
                      label={f(messages.fixBooking)}
                      order={order}
                      statusNum={ORDER_STATUS_BOOKED}
                      desc={f(messages.fixBookingDesc)}
                      icon={
                        <SaveIcon
                          className={classNames(
                            commonBtnCss,
                            status.booked ? "text-green-600" : "text-yellow-500"
                          )}
                        />
                      }
                    />
                  ) : null}
                </div>
              </Menu.Items>
            </Transition>
          ) : null}
        </>
      )}
    </Menu>
  );
};

export default OrderStatusBtn;
