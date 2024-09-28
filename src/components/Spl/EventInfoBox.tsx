import React from "react";
import { useIntl } from "react-intl";
import { DATE_WITH_TIME_FORMAT } from "../../utils/datetime_helpers";
import { ChevronLeftIcon } from "@heroicons/react/outline";

import { IEvent } from "../Event/interfaces";
import { Link } from "react-router-dom";

interface IEventInfoBox {
  event: IEvent;
}

export default function EventInfoBox({ event }: IEventInfoBox) {
  const { formatDate: d } = useIntl();

  return (
    <div className="absolute left-2 top-18 mt-1 right-2 group md:right-auto cursor-pointer z-10">
      <Link to={`/events/${event.id}`}>
        <div className="flex items-center text-sm text-left bg-gray-50 opacity-90 pr-5 pl-1 rounded-sm shadow text-gray-600 hover:opacity-1 hover:text-black">
          <ChevronLeftIcon className="h-8 w-8 text-gray-600 group-hover:text-gray-800 mr-4" />
          <div className="p-1">
            {event ? <div>{event.title}</div> : null}
            {event ? (
              <div className="date-date">
                {d(event.starts_at, DATE_WITH_TIME_FORMAT)}
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  );
}
