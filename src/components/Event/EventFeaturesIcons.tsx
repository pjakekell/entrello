import React from "react";
import { IEvent } from "./interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRing } from "@fortawesome/pro-solid-svg-icons";
import { EVENT_FEATURE_SPL } from "./logic";

interface IEventFeatures {
  event: IEvent;
}

const EventFeaturesIcons = ({ event }: IEventFeatures) => {
  const spl =
    (event.features & EVENT_FEATURE_SPL) === EVENT_FEATURE_SPL ? (
      <FontAwesomeIcon className="w-4 h-4 text-gray-500 p-1" icon={faRing} />
    ) : null;

  return <div className="flex items-center divide-x gap-2">{spl}</div>;
};

export default EventFeaturesIcons;

// <ViewGridIcon
//                   className={classNames(
//                     commonCss,
//                     spl ? "text-brand-500" : "text-gray-300"
//                   )}
//                 />
//                 <GiftIcon
//                   className={classNames(
//                     commonCss,
//                     vouchers ? "text-brand-500" : "text-gray-300",
//                     "hidden"
//                   )}
//                 />
//                 <ClockIcon
//                   className={classNames(
//                     commonCss,
//                     waitingRoom ? "text-brand-500" : "text-gray-300"
//                   )}
//                 />
//                 <ReceiptTaxIcon
//                   className={classNames(
//                     commonCss,
//                     promoCodes ? "text-brand-500" : "text-gray-300"
//                   )}
//                 />
//                 <BookOpenIcon
//                   className={classNames(
//                     commonCss,
//                     res ? "text-brand-500" : "text-gray-300"
//                   )}
//                 />
//                 <ClipboardListIcon
//                   className={classNames(
//                     commonCss,
//                     waitingList ? "text-brand-500" : "text-gray-300"
//                   )}
//                 />
