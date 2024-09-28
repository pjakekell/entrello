import React, { Fragment, useRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";

import { CREATE_INVOICE } from "./logic";
import messages from "../../i18n/messages";
import { useOrder } from "../../hooks/useOrder";

import { Transition, Dialog } from "@headlessui/react";
import OrderHistoryItemsListing from "./OrderHistoryItemsListing";

import { XIcon } from "@heroicons/react/outline";

const OrderHistoryDialog = () => {
  const { orderId } = useParams();
  const [order] = useOrder(orderId || "");
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const focusFieldRef = useRef(null);
  const [, { error }] = useMutation(CREATE_INVOICE);

  if (!order) return <></>;

  const handleClose = () => {
    navigate(location.pathname.split("/history")[0]);
  };

  return (
    <Transition.Root show as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={focusFieldRef}
        open
        onClose={handleClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex items-center">
                <div className="sm:text-left w-full">
                  <Dialog.Title as="div">
                    <div className="text-lg leading-6 font-medium text-brand-600">
                      {f(messages.orderHistory)}
                    </div>
                  </Dialog.Title>
                </div>
                <div
                  className="ml-auto flex-shrink-0 flex items-center justify-center h-8 w-8 sm:-mt-2 sm:-mr-2 sm:h-10 sm:w-10 cursor-pointer"
                  ref={focusFieldRef}
                  onClick={handleClose}
                >
                  <XIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-2">
                <OrderHistoryItemsListing order={order} />
              </div>
              {error ? (
                <div className="text-red-500 px-2 my-4">{error}</div>
              ) : null}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default OrderHistoryDialog;
