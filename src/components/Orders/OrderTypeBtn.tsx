import React, { Fragment } from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages.js";
import {
  ORDER_TYPE_REGULAR,
  ORDER_TYPE_RESERVATION,
  ORDER_TYPE_OPTION,
} from "./logic";
import { Menu, Transition } from "@headlessui/react";
import { IOrder } from "./interfaces";
import LoadingIcon from "../Btn/LoadingIcon";
import { ChevronDownIcon, SaveIcon } from "@heroicons/react/outline";
import { classNames } from "../../utils/misc";
import { useUpdateOrder } from "../../hooks/useUpdateOrder";

interface IToggleItem {
  icon: any;
  label: string;
  desc: string;
  order: IOrder;
  orderType: string;
}

const ToggleItem = ({ icon, desc, label, orderType, order }: IToggleItem) => {
  const [updateOrder, { loading, error }] = useUpdateOrder(order.id);
  const handleToggleAction = async () => {
    try {
      await updateOrder({ order_type: orderType });
    } catch (e) {
      console.error(e);
    }
  };

  const isActive = orderType === order.order_type;

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
            <div
              className={classNames(
                "text-xs font-bold uppercase",
                error ? "text-error-600" : null,
                isActive && !error ? "text-fuchsia-600" : "text-gray-700"
              )}
            >
              {error ? error.message : label}
            </div>
            <div
              className={classNames(
                "text-xs",
                error ? "text-error-600" : null,
                isActive && !error ? "text-fuchsia-600" : "text-gray-500"
              )}
            >
              {desc}
            </div>
          </div>
        </div>
      )}
    </Menu.Item>
  );
};

interface IOrderTypeBtnParams {
  order: IOrder;
}

const OrderTypeBtn = ({ order }: IOrderTypeBtnParams) => {
  const { formatMessage: f } = useIntl();

  const orderTypes = {
    [ORDER_TYPE_REGULAR]: messages.regularOrder,
    [ORDER_TYPE_RESERVATION]: messages.reservation,
    [ORDER_TYPE_OPTION]: messages.option,
  } as any;

  const msg: any =
    orderTypes[order.order_type] || orderTypes[ORDER_TYPE_REGULAR];
  return (
    <Menu as="div" className="ml-auto relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="flex items-center group cursor-pointer rounded-md px-4 py-1 focus:outline-none">
              <div
                className={classNames(
                  "uppercase text-xs pt-0.5 mr-2",
                  order.order_type === ORDER_TYPE_REGULAR
                    ? "text-gray-700"
                    : "text-fuchsia-600"
                )}
              >
                {f(msg)}
              </div>
              <div className="h-4">
                <ChevronDownIcon
                  className={classNames(
                    "w-4 h-4",
                    order.order_type === ORDER_TYPE_REGULAR
                      ? "text-gray-600 group-hover:text-gray-800"
                      : "text-fuchsia-500 group-hover:text-fuchsia-800"
                  )}
                />
              </div>
            </Menu.Button>
          </div>

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
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-1 divide-y">
                <ToggleItem
                  label={f(messages.regularOrder)}
                  order={order}
                  orderType={ORDER_TYPE_REGULAR}
                  desc={f(messages.regularOrderDesc)}
                  icon={
                    <SaveIcon
                      className={classNames(
                        order.order_type === ORDER_TYPE_REGULAR
                          ? "text-brand-600"
                          : "text-yellow-500"
                      )}
                    />
                  }
                />
                <ToggleItem
                  label={f(messages.reservation)}
                  order={order}
                  orderType={ORDER_TYPE_RESERVATION}
                  desc={f(messages.reservationDesc)}
                  icon={
                    <SaveIcon
                      className={classNames(
                        order.order_type === ORDER_TYPE_RESERVATION
                          ? "text-brand-600"
                          : "text-yellow-500"
                      )}
                    />
                  }
                />
                <ToggleItem
                  label={f(messages.option)}
                  order={order}
                  orderType={ORDER_TYPE_OPTION}
                  desc={f(messages.optionDesc)}
                  icon={
                    <SaveIcon
                      className={classNames(
                        order.order_type === ORDER_TYPE_OPTION
                          ? "text-brand-600"
                          : "text-yellow-500"
                      )}
                    />
                  }
                />
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default OrderTypeBtn;
