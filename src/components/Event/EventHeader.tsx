import React, { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faEllipsisV } from "@fortawesome/pro-regular-svg-icons/faEllipsisV";
import { faList } from "@fortawesome/pro-regular-svg-icons/faList";
import { faPencil } from "@fortawesome/pro-regular-svg-icons/faPencil";
import { useIntl } from "react-intl";

import DuplicateEventDialog from "./DuplicateEventDialog";
import FormatDateTime from "../common/FormatDateTime";
import NonSplOrder from "../Spl/NonSplOrder";

import { EVENT_FEATURE_SPL, EVENT_STATUS_ON_SALE } from "../Event/logic";
import messages from "../../i18n/messages";
import { classNames, buildEventShopUrl } from "../../utils/misc";
import { IEvent } from "../Event/interfaces";
import { useOrg } from "../../hooks/useOrg";
import { NEW_ORDER } from "../Orders/logic";

const EditEventOptions = ({ event }: any) => {
  const { formatMessage: f } = useIntl();
  const [org] = useOrg();
  const [open, setOpen] = useState(false);

  const handleToggleDuplicateEventDialog = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="rounded-full h-8 w-8 border-2 relative border-gray-400 text-gray-500 hover:bg-gray-400 hover:text-white cursor-pointer flex items-center justify-center">
            <span className="sr-only">options</span>
            <FontAwesomeIcon icon={faEllipsisV} className="h-5 w-5" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm cursor-pointer"
                    )}
                    onClick={handleToggleDuplicateEventDialog}
                  >
                    {f(messages.duplicateEvent)}...
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm cursor-pointer"
                    )}
                    onClick={() => window.open(buildEventShopUrl(org, event))}
                  >
                    {f(messages.showShopPageInNewTab)}
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm cursor-pointer"
                    )}
                  >
                    {f(messages.deleteEvent)}
                  </div>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <DuplicateEventDialog
        show={open}
        event={event}
        handleClose={handleToggleDuplicateEventDialog}
      />
    </div>
  );
};

interface IEventHeader {
  event: IEvent | null;
  loading?: boolean;
}

const EventHeader = ({ event, loading }: IEventHeader) => {
  const { formatMessage: f } = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisibleNonSPLOrder, setVisibleNonSPLOrder] = useState(false);

  if (loading || !event) {
    return (
      <div className="animate-pulse flex space-x-4 border-b border-gray-200">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-5 bg-gray-400 rounded w-1/6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-400 rounded w-1/5"></div>
            <div className="h-4 bg-gray-400 rounded w-1/5"></div>
          </div>
        </div>
        <div className="flex-0 py-1 ml-auto">
          <div className="flex items-center space-x-1">
            <div className="h-5 w-5 bg-gray-300 rounded-full" />
            <div className="h-5 w-5 bg-gray-300 rounded-full" />
            <div className="h-5 w-5 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const onSale = event.status_code & EVENT_STATUS_ON_SALE;
  const handleOpenOrders = () => {
    navigate(`/orders/e/${event.id}`);
  };

  const handleOpenEditEvent = () => {
    navigate(`/events/${event.id}`);
  };

  const onClickNewOrder = () => {
    if(!!(event.features & EVENT_FEATURE_SPL))
      navigate(`/events/${event.id}/spl`);
    else
      setVisibleNonSPLOrder(true);
  }

  return (
    <div>
      <div className="flex space-x-4 border-b border-gray-200">
        <div className="flex-1 pt-1">
          <div className="text-gray-600 flex items-center flex-grow">
            <p className="truncate mr-1 max-w-event-title truncate ...">
              {event.title}
            </p>
            {`- `}
            <FormatDateTime timeZone="Europe/Berlin" date={event.starts_at} />
          </div>
          <div className="space-y-1">
            <div className="text-gray-400 rounded">
              {event.subtitle ? (
                <div className="font-thin text-sm mb-2 max-w-1/2-vw truncate ...">
                  {event.subtitle}
                </div>
              ) : (
                <div className="font-thin uppercase text-gray-400 text-xs mb-2">
                  {f(messages.noEventSubtitle)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-0 py-1 ml-auto text-sm">
          <div className="flex items-center space-x-1">
            <div onClick={onClickNewOrder}>
              <button
                type="button"
                disabled={!onSale}
                className="inline-flex items-center justify-center sm:justify-start text-center sm:text-left px-2 sm:px-4 sm:py-1 border-2 rounded-full shadow-sm text-sm font-medium text-brand-500 hover:text-white border-brand-500 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                <span className="uppercase hidden sm:inline">
                  {f(messages.newOrder)}
                </span>
              </button>
              {
                isVisibleNonSPLOrder &&
                <NonSplOrder
                  eventId={event.id}
                  type={NEW_ORDER}
                  onHide={() => setVisibleNonSPLOrder(false)}
                />
              }              
            </div>
            {location.pathname.includes("/orders") ? (
              <div
                className={classNames(
                  "rounded-full h-8 w-8 border-2 relative border-gray-400 text-gray-500 hover:bg-gray-400 hover:text-white cursor-pointer"
                )}
                onClick={handleOpenEditEvent}
              >
                <FontAwesomeIcon
                  icon={faPencil}
                  className="absolute top-0 left-0 right-0 bottom-0 m-auto"
                />
              </div>
            ) : (
              <div
                className={classNames(
                  "rounded-full h-8 w-8 border-2 relative border-gray-400 text-gray-500 hover:bg-gray-400 hover:text-white cursor-pointer"
                )}
                onClick={handleOpenOrders}
              >
                <FontAwesomeIcon
                  icon={faList}
                  className="absolute top-0 left-0 right-0 bottom-0 m-auto"
                />
              </div>
            )}
            <EditEventOptions event={event} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
