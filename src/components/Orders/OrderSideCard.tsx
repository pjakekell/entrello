import React, { Fragment } from "react";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Tooltip, { Placement } from "../Tooltip/Tooltip";
import { customToastFn } from "../CustomToaster/CustomToaster";
import toast from "react-hot-toast";

import { selectEditCurOrderSeats } from "../../store/modules/orders/actions";
import OrderInfo from "./OrderInfo";
import EditSeatsInfo from "./EditSeatsInfo";

// import ShapesInfo from './ShapesInfo'

// @ts-ignore @headlessui/react@dev has no up-to-date type defs
import { Transition, Dialog } from "@headlessui/react";
import { XIcon, ClockIcon, TrashIcon } from "@heroicons/react/outline";
import { useIntl } from "react-intl";

import messages from "../../i18n/messages";
import { useDeleteOrder } from "../../hooks/useDeleteOrder";

export default function OrderSideCard() {
  const { orderId } = useParams();
  const { formatMessage: f } = useIntl();
  const location = useLocation();

  const editSeats = useSelector(selectEditCurOrderSeats);
  const navigate = useNavigate();
  const [deleteOrder] = useDeleteOrder();

  const handleClose = () => {
    navigate(location.pathname.split("/o/ord_")[0]);
  };

  const handleDeleteOrder = async () => {
    if (!orderId) {
      toast.custom(
        customToastFn({ message: f(messages.orderNotFound), level: "error" }),
        {
          position: "top-center",
        }
      );
      return;
    }
    const tid = toast.custom(
      customToastFn({ message: f(messages.deletingOrder), loading: true }),
      {
        position: "top-center",
      }
    );
    try {
      await deleteOrder(orderId || "");
      toast.custom(
        customToastFn({ message: f(messages.orderDeleted), level: "success" }),
        {
          position: "top-center",
        }
      );
    } catch (e: any) {
      toast.custom(customToastFn({ message: e.message, level: "error" }), {
        position: "top-center",
      });
    } finally {
      toast.remove(tid);
    }
  };

  const openOrderHistoryModal = () =>
    navigate(`${window.location.pathname}/history`);

  return (
    <>
      <Transition show as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed top-0 right-0 bottom-0 w-4/5 md:w-1/3"
          open
          onClose={() => {}}
        >
          <div className="fixed inset-y-0 right-0 pl-10 w-4/5 md:w-1/3 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-200 sm:duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200 sm:duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div>
                    <div className="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                      <button
                        className="rounded-md text-gray-300 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        onClick={handleClose}
                      >
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="absolute top-12 -left-11 ml-0.5">
                      <Tooltip
                        placement={Placement.left}
                        content={f(messages.showHistoryOfThisOrder)}
                      >
                        <div
                          className="cursor-pointer mb-1 rounded-md focus:outline-none border-2 border-gray-300 p-1 group hover:bg-gray-200 hover:border-gray-400"
                          onClick={openOrderHistoryModal}
                        >
                          <ClockIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </Tooltip>
                      <Tooltip
                        placement={Placement.left}
                        content={f(messages.delete)}
                      >
                        <div
                          className="cursor-pointer mb-1 rounded-md focus:outline-none border-2 border-gray-300 p-1 group hover:bg-yellow-100 hover:border-yellow-400"
                          onClick={handleDeleteOrder}
                        >
                          <TrashIcon className="w-4 h-4 text-gray-400 group-hover:text-yellow-500" />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </Transition.Child>
                <div
                  className={`h-full flex flex-col bg-white shadow-xl border-l overflow-y-auto overflow-x-hidden`}
                >
                  {orderId ? <OrderInfo id={orderId} /> : null}
                  {orderId && editSeats ? <EditSeatsInfo id={orderId} /> : null}
                </div>
              </div>
            </Transition.Child>
            <Outlet />
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
