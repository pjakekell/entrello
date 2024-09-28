import React, { useState } from "react";
import sortBy from "lodash/sortBy";
import messages from "../../i18n/messages";
import { useIntl } from "react-intl";
import { IEvent } from "../Event/interfaces";
import { Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/pro-regular-svg-icons/faExclamation";

import { PlusIcon } from "@heroicons/react/solid";
import LoadingIcon from "../Btn/LoadingIcon";
import CreateSeatingPlanModal from "./CreateSeatingPlanModal";
import EventStatus from "./EventStatus";
import EventStats from "./EventStats";
import EventHeader from "./EventHeader";
import Container from "../Layout/Container";
import FormatDateTime from "../common/FormatDateTime";

import { classNames } from "../../utils/misc";
import { useSyncEvents } from "../../hooks/useSyncEvents";
import { EVENT_FEATURE_SPL, FETCH_EVENT_BY_ID } from "./logic";
interface IEventMenuItem {
  title: any;
  link: string;
  parent?: boolean;
  defaultActive?: boolean;
  alertText?: string | null;
  loadable?: boolean;
}

const EventMenuItem = ({
  link,
  title,
  alertText,
  defaultActive = false,
  loadable = false,
}: IEventMenuItem) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    if (loadable) setLoading(true);
    setTimeout(() => navigate(link), 100);
  };
  const { id } = useParams();
  const queryPartArr = window.location.pathname.split(id || "");
  const queryPart = queryPartArr.length > 1 ? queryPartArr[1] : "";
  const isActive =
    window.location.pathname.includes(link) ||
    (defaultActive &&
      (queryPart === "" || queryPart.match(/\/o\/|\/overview/)));
  const activeClass = isActive
    ? "border-brand-600 border-l-2 font-bold"
    : "border-gray-200 border-l";
  const className = `py-1 text-sm text-gray-500 cursor-pointer transition duration-200 ease-in-out flex items-center`;
  return (
    <div onClick={handleClick}>
      <div className={classNames(className, activeClass)}>
        {loading ? <LoadingIcon color="text-brand-400" /> : null}
        <div
          className={classNames(
            "ml-4 flex items-center",
            alertText ? "text-yellow-600" : ""
          )}
        >
          {title}
          {alertText ? (
            <div>
              <FontAwesomeIcon icon={faExclamation} className="w-4 h-4 ml-2" />
              <FontAwesomeIcon icon={faExclamation} className="w-4 h-4 -ml-2" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

interface ISeatingPlanMenuItem {
  event?: IEvent;
}

const SeatingPlanMenuItem = ({ event }: ISeatingPlanMenuItem) => {
  const navigate = useNavigate();
  const [showCreateSplModal, toggleShowCreateSplModal] = useState(false);
  const { formatMessage: f } = useIntl();
  const link = "spl";
  const { id } = useParams();

  const handleClick = () => {
    if (event && event.seating_plan) {
      setTimeout(() => navigate(`/events/${id}/${link}`), 100);
      return;
    }
    toggleShowCreateSplModal(true);
  };

  const activeClass = window.location.pathname.includes(link)
    ? "border-brand-600 font-bold border-l-2"
    : "border-gray-200 border-l";
  const className = `px-4 py-1 text-sm text-gray-500 cursor-pointer transition duration-200 ease-in-out flex items-center ${activeClass}`;
  return (
    <div onClick={handleClick} className="group">
      <div className={className}>
        <div className="truncate">
          <div
            className={classNames(
              "inline-block",
              !event || !event.seating_plan
                ? "text-gray-300 group-hover:opacity-0"
                : "text-gray-500"
            )}
          >
            {f(messages.seatingPlan)}
          </div>
          {event && !event.seating_plan ? (
            <div className="inline-block group-hover:opacity-100 text-brand-500 opacity-0">
              {f(messages.createSeatingPlan)}
            </div>
          ) : null}
        </div>
        {event && !event.seating_plan ? (
          <div
            className={classNames(
              "ml-auto w-6 h-6 rounded-full border-gray-300 border-2 flex items-center justify-center",
              "group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500"
            )}
          >
            <PlusIcon className="h-5 w-5 text-gray-300 group-hover:text-white" />
          </div>
        ) : null}
      </div>
      <CreateSeatingPlanModal
        open={showCreateSplModal}
        setOpen={toggleShowCreateSplModal}
      />
    </div>
  );
};

interface IEventsSelect {
  event: IEvent;
}

const EventsMenuList = ({ event }: IEventsSelect) => {
  const { formatMessage: f } = useIntl();
  const [events, { loading, error }] = useSyncEvents(event.sync_id || "");

  if (loading || !events) {
    return (
      <>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-light-blue-400 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-light-blue-400 rounded"></div>
              <div className="h-4 bg-light-blue-400 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    toast(error.message, {
      toastId: error.message,
      type: toast.TYPE.ERROR,
    });
  }

  return (
    <div className="mt-1">
      <div className="menu-title mt-2">{f(messages.dates)}</div>
      {events
        ? sortBy(events, (ev: IEvent) => ev.starts_at).map((event: IEvent) => (
            <EventMenuItem
              link={`/events/${event.id}`}
              key={event.id}
              title={
                <FormatDateTime
                  timeZone="Europe/Berlin"
                  date={event.starts_at}
                />
              }
            />
          ))
        : null}
    </div>
  );
};

const EventView = () => {
  const { formatMessage: f } = useIntl();
  const { id } = useParams();
  const { data, loading } = useQuery(FETCH_EVENT_BY_ID, {
    variables: { id },
  });

  const event: IEvent | null = data ? data.event : null;
  if (loading || !event) return <></>;

  return (
    <Container>
      <div className="mt-4 h-full flex flex-col items-stretch justify-strech">
        <div className="pl-8 pr-4">
          <EventHeader event={event ? event : null} loading={loading} />
        </div>
        <div className="flex-grow-0 h-full">
          <div className="grid grid-cols-12 md:gap-2 h-full">
            <div className="col-span-4 lg:col-span-3 ml-4">
              {event ? <EventStatus event={event} /> : null}
              {event ? <EventStats event={event} /> : null}
              <div className="mt-4">
                <div className="md:pr-8">
                  <EventMenuItem
                    title={f(messages.overview)}
                    defaultActive
                    link={`/events/${id}/overview`}
                  />
                  <EventMenuItem
                    title={f(messages.settings)}
                    link={`/events/${id}/settings`}
                  />
                  <EventMenuItem
                    title={f(messages.media)}
                    link={`/events/${id}/media`}
                  />
                  <EventMenuItem
                    title={f(messages.prices)}
                    alertText={
                      event && event.prices && event.prices.length > 0
                        ? null
                        : f(messages.noPricesYet)
                    }
                    link={`/events/${id}/prices`}
                  />
                  <EventMenuItem
                    title={f(messages.webshop)}
                    link={`/events/${id}/webshop`}
                  />
                  {
                    !!(event.features & EVENT_FEATURE_SPL) &&
                    <SeatingPlanMenuItem event={event} />
                  }
                  <EventMenuItem
                    title={f(messages.features)}
                    link={`/events/${id}/features`}
                  />
                </div>
                {event && <EventsMenuList event={event} />}
              </div>
            </div>
            <div className="mt-5 md:mt-0 col-span-8 2xl:col-span-9 bg-gray-50 border-l border-gray-200">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EventView;
