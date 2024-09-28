import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { useQuery } from "@apollo/react-hooks";
import { useDispatch } from "react-redux";

import { IOrder } from "../Orders/interfaces";
import { FETCH_CONTINGENTS_BY_EVENT_ID } from "../Orders/logic";
import { classNames } from "../../utils/misc";
import { setMsg } from "../Toaster/logic";

import ContingentListing from "../Orders/ContingentListing";
// import ShapesInfo from './ShapesInfo'
import { updateOrderSeats } from "./tools/seat_active_toggles";
import messages from "../../i18n/messages";

// @ts-ignore @headlessui/react@dev has no up-to-date type defs
import { Transition, Dialog } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import LoadingIcon from "../Btn/LoadingIcon";

const updateOrderFromSubscription = (order: IOrder) => {
  updateOrderSeats(order);
};

interface IToggleContingent {
  toggleBtn: any;
  qty: number;
  loading: boolean;
}

const ToggleContingentBtn = ({
  loading,
  toggleBtn,
  qty,
}: IToggleContingent) => {
  const { formatMessage: f } = useIntl();
  return (
    <button
      className="absolute bottom-2 right-2 flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white cursor-pointer"
      onClick={() => toggleBtn()}
    >
      <div className="mr-2 text-sm">{f(messages.contingents)}</div>
      <MenuIcon className="block h-5 w-5" aria-hidden="true" />
      <div
        className={classNames(
          "absolute top-1 right-1 w-3 h-3 flex items-center justify-center p-2 rounded-full text-2xs border",
          qty > 0
            ? "bg-indigo-400 border-indigo-500 text-white"
            : "border-gray-400 text-gray-500 bg-gray-200"
        )}
      >
        {loading ? <LoadingIcon size={22} /> : qty}
      </div>
    </button>
  );
};

export default function ContingentSideCard() {
  const { id } = useParams();
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();

  const [showContingent, setShowContingent] = useState(false);

  const { loading, data } = useQuery(FETCH_CONTINGENTS_BY_EVENT_ID, {
    variables: { event_id: id },
  });

  if (data && data.orderChanged) updateOrderFromSubscription(data.orderChanged);

  const qty =
    data && data.orders
      ? data.orders.reduce((acc: number, o: IOrder) => acc + o.qty, 0)
      : 0;

  const handleToggleOpen = () => {
    if (qty > 0) {
      setShowContingent(!showContingent);
      return;
    }
    dispatch(setMsg({ title: f(messages.noContingentsYet) }));
  };

  return (
    <>
      <ToggleContingentBtn
        toggleBtn={handleToggleOpen}
        loading={loading}
        qty={qty}
      />
      <Transition show={showContingent} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed top-0 right-0 bottom-0 w-overflow-hidden w-4/5 md:w-1/3"
          open={showContingent}
          onClose={handleToggleOpen}
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
                  <div className="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                    <button
                      className="rounded-md text-gray-300 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      onClick={() => handleToggleOpen()}
                    >
                      <span className="sr-only">Close panel</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="h-full flex flex-col pb-6 bg-white shadow-xl overflow-y-scroll border-l border-gray-300">
                  <ContingentListing />
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
