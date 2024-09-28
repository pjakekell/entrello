import { faExclamationTriangle } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IOrg } from "../components/Org/interfaces";
import { IEvent } from "../components/Event/interfaces";
import React from "react";
import origToast from "react-hot-toast";

export const EXT_ID_LENGTH = 28;

export const classNames = (...classes: any) =>
  classes.filter(Boolean).join(" ");

export const toast = (msg: string) => {
  return origToast.custom(
    (t: any) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="h-10 w-10"
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Attention!</p>
              <p className="mt-1 text-sm text-gray-500">{msg}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => origToast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ),
    { position: "top-center" }
  );
};

export const DatePickerStyles = {
  weekend: {
    color: "#4F46E5 !important",
  },
  selected: {
    backgroundColor: "rgba(232, 83, 0) !important",
    color: "white !important",
  },
};

export const buildEventShopUrl = (org: IOrg, event: IEvent) =>
  `${process.env.REACT_APP_SHOP_HOSTNAME}/${org.slug}/events/${event.id}/tickets`;
