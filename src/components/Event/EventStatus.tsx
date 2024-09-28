import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages.js";
import {
  EVENT_STATUS_ON_SALE,
  EVENT_STATUS_PUBLISHED,
  EVENT_STATUS_MOVED,
  EVENT_STATUS_FORCE_SOLD_OUT,
  EVENT_STATUS_CANCELLED,
} from "../Event/logic";
import { IEvent } from "./interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagsShopping } from "@fortawesome/pro-regular-svg-icons/faBagsShopping";
import { faSquareUpRight } from "@fortawesome/pro-regular-svg-icons/faSquareUpRight";
import { faCartShopping } from "@fortawesome/pro-regular-svg-icons/faCartShopping";
import { faCalendarPen } from "@fortawesome/pro-regular-svg-icons/faCalendarPen";
import { faCircleExclamationCheck } from "@fortawesome/pro-regular-svg-icons/faCircleExclamationCheck";
import { faMicrophoneSlash } from "@fortawesome/pro-regular-svg-icons/faMicrophoneSlash";
import { buildEventShopUrl, classNames } from "../../utils/misc";
import { useToggleEventStatus } from "../../hooks/useToggleEventStatus";
import { useOrg } from "../../hooks/useOrg";
import Tooltip from "../Tooltip/Tooltip";

interface IEventStatus {
  event: IEvent;
}

export const EventStatusIcons = ({ event }: IEventStatus) => {
  const status = event.status_code;
  const [toggleEventStatus] = useToggleEventStatus(event);

  const onSale =
    status & EVENT_STATUS_ON_SALE ? (
      <FontAwesomeIcon
        className="w-4 h-4 text-green-600 group-hover:text-white rounded-full p-1 group-hover:bg-green-600"
        icon={faBagsShopping}
      />
    ) : (
      <FontAwesomeIcon
        className="w-4 h-4 text-yellow-500 group-hover:text-white rounded-full p-1 group-hover:bg-yellow-500"
        icon={faBagsShopping}
      />
    );
  const published =
    status & EVENT_STATUS_PUBLISHED ? (
      <FontAwesomeIcon
        icon={faCartShopping}
        className="h-4 w-4 text-green-600 group-hover:text-white rounded-full p-1 group-hover:bg-green-600"
      />
    ) : (
      <FontAwesomeIcon
        icon={faCartShopping}
        className="h-4 w-4 text-yellow-500 group-hover:text-white rounded-full p-1 group-hover:bg-yellow-500"
      />
    );
  const cancelled =
    status & EVENT_STATUS_CANCELLED ? (
      <FontAwesomeIcon
        className="w-4 h-4 text-green-600"
        icon={faMicrophoneSlash}
      />
    ) : null;
  const moved =
    status & EVENT_STATUS_MOVED ? (
      <FontAwesomeIcon
        className="w-4 h-4 text-yellow-500"
        icon={faCalendarPen}
      />
    ) : null;
  const forceSoldOut =
    status & EVENT_STATUS_FORCE_SOLD_OUT ? (
      <FontAwesomeIcon
        className="w-4 h-4 text-yellow-500"
        icon={faCircleExclamationCheck}
      />
    ) : null;

  const handleToggleStatus = (statusBit: number) => {
    try {
      toggleEventStatus(statusBit);
    } catch (e) {
      // TODO: proper error handling
      console.log("errro updating event status", e);
    }
  };

  const handleToggleOnSale = (e: any) => {
    e.stopPropagation();
    handleToggleStatus(EVENT_STATUS_ON_SALE);
  };
  const handleTogglePublished = (e: any) => {
    e.stopPropagation();
    handleToggleStatus(EVENT_STATUS_PUBLISHED);
  };

  return (
    <div className="flex items-center">
      <div className="cursor-pointer group" onClick={handleToggleOnSale}>
        {onSale}
      </div>
      <div className="cursor-pointer group" onClick={handleTogglePublished}>
        {published}
      </div>
      <div className="px-1">{cancelled}</div>
      <div className="px-1">{moved}</div>
      <div className="px-1">{forceSoldOut}</div>
    </div>
  );
};

const EventStatusText = ({ event }: IEventStatus) => {
  const { formatMessage: f } = useIntl();
  let text = f(messages.openAndPublished);
  if (
    event.status_code & EVENT_STATUS_ON_SALE &&
    !(event.status_code & EVENT_STATUS_PUBLISHED)
  )
    text = f(messages.openNotPublished);
  if (
    !(event.status_code & EVENT_STATUS_ON_SALE) &&
    !(event.status_code & EVENT_STATUS_PUBLISHED)
  )
    text = f(messages.notOpenNotPublished);
  if (
    !(event.status_code & EVENT_STATUS_ON_SALE) &&
    event.status_code & EVENT_STATUS_PUBLISHED
  )
    text = f(messages.notOpenButPublished);
  const published =
    event.status_code & EVENT_STATUS_PUBLISHED &&
    event.status_code & EVENT_STATUS_ON_SALE ? (
      <div className="text-green-600 font-bold text-xs leading-none">
        {text}
      </div>
    ) : (
      <div className="text-yellow-500 font-bold text-xs leading-none">
        {text}
      </div>
    );

  return (
    <div className="flex">
      <div className={classNames("text-sm font-bold cursor-pointer")}>
        {published}
      </div>
    </div>
  );
};

const EventStatus = ({ event }: IEventStatus) => {
  const { formatMessage: f } = useIntl();
  const [org] = useOrg();
  const published =
    (event.status_code & EVENT_STATUS_PUBLISHED) === EVENT_STATUS_PUBLISHED;

  return (
    <div className="">
      <div>
        <label className="text-2xs uppercase text-gray-400">
          {f(messages.status)}
        </label>
      </div>
      <div className="m-2">
        <div className="mb-2 flex items-center">
          <EventStatusIcons event={event} />
          <div className="ml-auto">
            <Tooltip
              content={
                published
                  ? f(messages.showShopPageInNewTab)
                  : f(messages.eventNotPublished)
              }
            >
              <a
                href={buildEventShopUrl(org, event)}
                onClick={(e) => (published ? null : e.preventDefault())}
                className={published ? "" : "cursor-default"}
                rel="noreferrer"
                target="_blank"
              >
                <FontAwesomeIcon
                  icon={faSquareUpRight}
                  className={`${
                    published ? "text-brand-500" : "text-gray-400"
                  } w-4 h-4}`}
                />
              </a>
            </Tooltip>
          </div>
        </div>
        <EventStatusText event={event} />
      </div>
    </div>
  );
};

export default EventStatus;
